/**
 * リクエスト管理ユーティリティ - デバウンス、スロットル、重複防止
 */

/**
 * デバウンス - 連続した呼び出しを最後の1回だけ実行
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * スロットル - 一定時間内に最大1回だけ実行
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 重複リクエスト防止 - 同じリクエストが進行中の場合、既存のPromiseを返す
 */
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();
  // #TODO: タイムアウト機能を追加（長時間保留されているリクエストを自動削除）
  // #TODO: リクエストの有効期限を設定（古いリクエストは無効化）

  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // 既に進行中のリクエストがある場合はそれを返す
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)! as Promise<T>;
    }

    // 新しいリクエストを作成
    const promise = requestFn().finally(() => {
      // 完了したら削除
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear(): void {
    this.pendingRequests.clear();
  }
  
  // #TODO: 特定のキーパターンでリクエストをキャンセルする機能
  // #TODO: リクエストの統計情報を取得する機能（進行中のリクエスト数等）
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * React用のデバウンスフック
 */
import { useRef, useCallback } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // #TODO: useEffectでクリーンアップを追加（コンポーネントのアンマウント時にタイマーをクリア）
  // useEffect(() => {
  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * React用のスロットルフック
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRunRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRunRef.current >= delay) {
        callback(...args);
        lastRunRef.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * AbortControllerの管理
 */
export class AbortControllerManager {
  private controllers = new Map<string, AbortController>();

  getController(key: string): AbortController {
    // 既存のコントローラーをキャンセル
    this.abort(key);

    // 新しいコントローラーを作成
    const controller = new AbortController();
    this.controllers.set(key, controller);
    return controller;
  }

  abort(key: string): void {
    const controller = this.controllers.get(key);
    if (controller) {
      controller.abort();
      this.controllers.delete(key);
    }
  }

  abortAll(): void {
    for (const controller of this.controllers.values()) {
      controller.abort();
    }
    this.controllers.clear();
  }

  getSignal(key: string): AbortSignal | undefined {
    return this.controllers.get(key)?.signal;
  }
}

export const abortControllerManager = new AbortControllerManager();

