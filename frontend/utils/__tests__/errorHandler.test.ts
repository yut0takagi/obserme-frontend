import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  classifyError,
  handleError,
  getUserErrorMessage,
  isRetryableError,
  ErrorType,
} from '../errorHandler';

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('classifyError', () => {
    it('AbortErrorを正しく分類する', () => {
      const error = new Error('Request aborted');
      error.name = 'AbortError';
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.ABORT);
      expect(result.retryable).toBe(false);
      expect(result.userMessage).toContain('キャンセル');
    });

    it('ネットワークエラーを正しく分類する', () => {
      const error = new Error('Failed to fetch');
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.NETWORK);
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toContain('ネットワーク');
    });

    it('タイムアウトエラーを正しく分類する', () => {
      const error = new Error('Request timeout');
      error.name = 'TimeoutError';
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.TIMEOUT);
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toContain('タイムアウト');
    });

    it('レート制限エラーを正しく分類する', () => {
      const error = new Error('Rate limit exceeded');
      (error as any).status = 429;
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.RATE_LIMIT);
      expect(result.statusCode).toBe(429);
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toContain('レート制限');
    });

    it('401認証エラーを正しく分類する', () => {
      const error = new Error('Unauthorized');
      (error as any).status = 401;
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.AUTHENTICATION);
      expect(result.statusCode).toBe(401);
      expect(result.retryable).toBe(false);
      expect(result.userMessage).toContain('認証');
    });

    it('403認可エラーを正しく分類する', () => {
      const error = new Error('Forbidden');
      (error as any).status = 403;
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.AUTHORIZATION);
      expect(result.statusCode).toBe(403);
      expect(result.retryable).toBe(false);
      expect(result.userMessage).toContain('権限');
    });

    it('404エラーを正しく分類する', () => {
      const error = new Error('Not found');
      (error as any).status = 404;
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.CLIENT);
      expect(result.statusCode).toBe(404);
      expect(result.retryable).toBe(false);
      expect(result.userMessage).toContain('見つかりません');
    });

    it('422バリデーションエラーを正しく分類する', () => {
      const error = new Error('Validation error');
      (error as any).status = 422;
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.VALIDATION);
      expect(result.statusCode).toBe(422);
      expect(result.retryable).toBe(false);
      expect(result.userMessage).toContain('入力内容');
    });

    it('500サーバーエラーを正しく分類する', () => {
      const error = new Error('Internal server error');
      (error as any).status = 500;
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.SERVER);
      expect(result.statusCode).toBe(500);
      expect(result.retryable).toBe(true);
      expect(result.userMessage).toContain('サーバー');
    });

    it('不明なエラーを正しく分類する', () => {
      const error = new Error('Unknown error');
      
      const result = classifyError(error);
      
      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.retryable).toBe(false);
      expect(result.userMessage).toContain('予期しない');
    });
  });

  describe('handleError', () => {
    it('エラーを分類してログに記録する', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Test error');
      (error as any).status = 500;
      
      const result = handleError(error, 'test-context');
      
      expect(result.type).toBe(ErrorType.SERVER);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('getUserErrorMessage', () => {
    it('ユーザーフレンドリーなエラーメッセージを返す', () => {
      const error = new Error('Network error');
      
      const message = getUserErrorMessage(error);
      
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });

  describe('isRetryableError', () => {
    it('リトライ可能なエラーを正しく判定する', () => {
      const error = new Error('Server error');
      (error as any).status = 500;
      
      expect(isRetryableError(error)).toBe(true);
    });

    it('リトライ不可能なエラーを正しく判定する', () => {
      const error = new Error('Client error');
      (error as any).status = 400;
      
      expect(isRetryableError(error)).toBe(false);
    });
  });
});

