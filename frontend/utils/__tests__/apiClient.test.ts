import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../apiClient';

// fetchのモック
global.fetch = vi.fn();

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiClient.clearCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET request', () => {
    it('正常なGETリクエストを処理する', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockData);
    });

    it('キャッシュからデータを取得する', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      // 最初のリクエスト
      await apiClient.get('/test', { cache: true });

      // 2回目のリクエスト（キャッシュから取得）
      const result = await apiClient.get('/test', { cache: true });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it('キャッシュを無効化してリクエストする', async () => {
      const mockData1 = { id: 1, name: 'Test1' };
      const mockData2 = { id: 2, name: 'Test2' };
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData2,
        });

      await apiClient.get('/test', { cache: true });
      const result = await apiClient.get('/test', { cache: false });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockData2);
    });
  });

  describe('POST request', () => {
    it('正常なPOSTリクエストを処理する', async () => {
      const requestBody = { name: 'Test' };
      const mockData = { id: 1, ...requestBody };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.post('/test', requestBody);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('Error handling', () => {
    it('HTTPエラーを適切に処理する', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      await expect(apiClient.get('/test')).rejects.toThrow();
    });

    it('ネットワークエラーを適切に処理する', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow();
    });

    it('リトライロジックが動作する', async () => {
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const result = await apiClient.get('/test', {
        retry: { maxAttempts: 3, delay: 100 },
      });

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ success: true });
    });
  });

  describe('AbortController', () => {
    it('AbortSignalでリクエストをキャンセルできる', async () => {
      const controller = new AbortController();
      
      (global.fetch as any).mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            controller.abort();
            reject(new Error('Aborted'));
          }, 100);
        });
      });

      await expect(
        apiClient.get('/test', { signal: controller.signal })
      ).rejects.toThrow();
    });
  });
});

