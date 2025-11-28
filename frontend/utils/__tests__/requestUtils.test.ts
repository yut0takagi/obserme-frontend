import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  requestDeduplicator,
  AbortControllerManager,
} from '../requestUtils';

describe('requestUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('debounce', () => {
    it('連続した呼び出しを最後の1回だけ実行する', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('call1');
      debouncedFn('call2');
      debouncedFn('call3');

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('call3');
    });

    it('待機時間内に再度呼び出された場合、タイマーをリセットする', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('call1');
      vi.advanceTimersByTime(50);
      debouncedFn('call2');
      vi.advanceTimersByTime(50);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('call2');
    });
  });

  describe('throttle', () => {
    it('一定時間内に最大1回だけ実行する', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn('call1');
      throttledFn('call2');
      throttledFn('call3');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('call1');

      vi.advanceTimersByTime(100);

      throttledFn('call4');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith('call4');
    });
  });

  describe('RequestDeduplicator', () => {
    it('同じキーで重複リクエストを防止する', async () => {
      const requestFn = vi.fn().mockResolvedValue('result');
      
      // 2つのリクエストを同時に開始
      const promise1 = requestDeduplicator.deduplicate('key1', requestFn);
      const promise2 = requestDeduplicator.deduplicate('key1', requestFn);

      // リクエスト関数は1回だけ呼ばれることを確認
      expect(requestFn).toHaveBeenCalledTimes(1);

      // 両方のPromiseが同じ結果を返すことを確認
      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBe('result');
      expect(result2).toBe('result');
      // リクエスト関数は1回だけ呼ばれる（重複リクエストが防止されている）
      expect(requestFn).toHaveBeenCalledTimes(1);
    });

    it('異なるキーでは別々のリクエストを実行する', async () => {
      const requestFn1 = vi.fn().mockResolvedValue('result1');
      const requestFn2 = vi.fn().mockResolvedValue('result2');
      
      const promise1 = requestDeduplicator.deduplicate('key1', requestFn1);
      const promise2 = requestDeduplicator.deduplicate('key2', requestFn2);

      expect(promise1).not.toBe(promise2);
      expect(requestFn1).toHaveBeenCalledTimes(1);
      expect(requestFn2).toHaveBeenCalledTimes(1);

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBe('result1');
      expect(result2).toBe('result2');
    });

    it('リクエスト完了後にキーを削除する', async () => {
      const requestFn = vi.fn().mockResolvedValue('result');
      
      await requestDeduplicator.deduplicate('key1', requestFn);
      
      // 再度同じキーでリクエストすると、新しいリクエストが実行される
      const requestFn2 = vi.fn().mockResolvedValue('result2');
      await requestDeduplicator.deduplicate('key1', requestFn2);

      expect(requestFn2).toHaveBeenCalledTimes(1);
    });

    it('エラーが発生した場合もキーを削除する', async () => {
      const requestFn = vi.fn().mockRejectedValue(new Error('Error'));
      
      try {
        await requestDeduplicator.deduplicate('key1', requestFn);
      } catch (e) {
        // エラーは無視
      }
      
      // 再度同じキーでリクエストすると、新しいリクエストが実行される
      const requestFn2 = vi.fn().mockResolvedValue('result');
      await requestDeduplicator.deduplicate('key1', requestFn2);

      expect(requestFn2).toHaveBeenCalledTimes(1);
    });

    it('clearメソッドで全てのリクエストをクリアする', async () => {
      const requestFn = vi.fn().mockResolvedValue('result');
      
      const promise = requestDeduplicator.deduplicate('key1', requestFn);
      requestDeduplicator.clear();
      
      // クリア後は新しいリクエストが実行される
      const requestFn2 = vi.fn().mockResolvedValue('result2');
      const promise2 = requestDeduplicator.deduplicate('key1', requestFn2);

      expect(promise).not.toBe(promise2);
      expect(requestFn2).toHaveBeenCalledTimes(1);
    });
  });

  describe('AbortControllerManager', () => {
    it('新しいコントローラーを作成する', () => {
      const manager = new AbortControllerManager();
      const controller = manager.getController('key1');

      expect(controller).toBeInstanceOf(AbortController);
      expect(controller.signal.aborted).toBe(false);
    });

    it('既存のコントローラーをキャンセルして新しいものを作成する', () => {
      const manager = new AbortControllerManager();
      const controller1 = manager.getController('key1');
      const controller2 = manager.getController('key1');

      expect(controller1.signal.aborted).toBe(true);
      expect(controller2).not.toBe(controller1);
      expect(controller2.signal.aborted).toBe(false);
    });

    it('特定のキーのコントローラーをキャンセルする', () => {
      const manager = new AbortControllerManager();
      const controller = manager.getController('key1');

      manager.abort('key1');

      expect(controller.signal.aborted).toBe(true);
    });

    it('全てのコントローラーをキャンセルする', () => {
      const manager = new AbortControllerManager();
      const controller1 = manager.getController('key1');
      const controller2 = manager.getController('key2');

      manager.abortAll();

      expect(controller1.signal.aborted).toBe(true);
      expect(controller2.signal.aborted).toBe(true);
    });

    it('シグナルを取得する', () => {
      const manager = new AbortControllerManager();
      const controller = manager.getController('key1');
      const signal = manager.getSignal('key1');

      expect(signal).toBe(controller.signal);
    });

    it('存在しないキーのシグナルはundefinedを返す', () => {
      const manager = new AbortControllerManager();
      const signal = manager.getSignal('nonexistent');

      expect(signal).toBeUndefined();
    });
  });
});

