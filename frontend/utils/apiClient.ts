/**
 * APIクライアント - レート制限、リトライ、キャッシュ、AbortController対応
 */

import { apiConfig } from '../config/env';
import { handleError, isRetryableError, ErrorType } from './errorHandler';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
  cache?: boolean;
  cacheTTL?: number; // ミリ秒
  retry?: {
    maxAttempts?: number;
    delay?: number;
    backoff?: 'linear' | 'exponential';
  };
  // 新しい設定システム用のオプション
  service?: string;        // サービス名（例: 'backend', 'gemini'）
  endpoint?: string;       // エンドポイント名（例: 'tasks', 'generateContent'）
  endpointParams?: Record<string, string>; // エンドポイントパラメータ
  // #TODO: タイムアウト設定を追加（デフォルト30秒）
  // timeout?: number; // ミリ秒
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    // 古いリクエストを削除
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitIfNeeded();
      }
    }

    this.requests.push(now);
  }
}

class RequestCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    this.defaultTTL = defaultTTL;
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // 期限切れエントリを削除
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

class ApiClient {
  private rateLimiter: RateLimiter;
  private cache: RequestCache;
  private pendingRequests = new Map<string, Promise<any>>();

  constructor(
    maxRequestsPerMinute: number = 60,
    cacheDefaultTTL: number = 5 * 60 * 1000
  ) {
    this.rateLimiter = new RateLimiter(maxRequestsPerMinute, 60 * 1000);
    this.cache = new RequestCache(cacheDefaultTTL);
    
    // 定期的にキャッシュをクリーンアップ
    setInterval(() => this.cache.cleanup(), 60 * 1000);
    
    // #TODO: リクエスト/レスポンスのログ記録機能を追加
    // #TODO: エラー追跡システム（Sentry等）との統合
    // #TODO: パフォーマンスメトリクスの収集（リクエスト時間、成功率等）
  }

  private generateCacheKey(url: string, config: RequestConfig): string {
    return `${config.method || 'GET'}:${url}:${JSON.stringify(config.body || {})}`;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000,
    backoff: 'linear' | 'exponential' = 'exponential'
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        // AbortErrorの場合はリトライしない
        if (error.name === 'AbortError') {
          throw error;
        }

        // リトライ不可能なエラーの場合は即座にthrow
        if (!isRetryableError(error)) {
          throw error;
        }

        // 最後の試行でない場合のみ待機
        if (attempt < maxAttempts) {
          const waitTime = backoff === 'exponential' 
            ? delay * Math.pow(2, attempt - 1)
            : delay * attempt;
          await this.sleep(waitTime);
        }
      }
    }

    // 最後のエラーを分類してユーザーフレンドリーなメッセージに変換
    if (lastError) {
      const appError = handleError(lastError, 'apiClient.retryRequest');
      throw new Error(appError.userMessage);
    }
    
    throw new Error('Request failed');
  }

  async request<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      signal,
      cache = method === 'GET',
      cacheTTL,
      retry = { maxAttempts: 3, delay: 1000, backoff: 'exponential' },
      service,
      endpoint,
      endpointParams,
    } = config;

    // URLの決定: サービス名とエンドポイント名が指定されている場合は設定から取得
    let fullUrl: string;
    if (service && endpoint) {
      // 新しい方式: サービス名とエンドポイント名で指定
      fullUrl = apiConfig.getEndpoint(service, endpoint, endpointParams);
    } else if (url.startsWith('http')) {
      // 完全なURLが指定されている場合
      fullUrl = url;
    } else {
      // 相対URLの場合（後方互換性）- バックエンドAPIのベースパスを使用
      const basePath = apiConfig.getBasePath('backend');
      fullUrl = `${basePath}${url.startsWith('/') ? url : `/${url}`}`;
    }

    // キャッシュキーを生成（fullUrlを使用）
    const cacheKey = this.generateCacheKey(fullUrl, config);

    // キャッシュから取得を試みる
    if (cache && method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached !== null) {
        return cached as T;
      }
    }

    // 重複リクエストの防止
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)! as Promise<T>;
    }

    // リクエストの実行
    const requestPromise = (async () => {
      try {
        // レート制限のチェック
        await this.rateLimiter.waitIfNeeded();

        // リトライロジック付きでリクエストを実行
        const result = await this.retryRequest(
          async () => {
            const response = await fetch(fullUrl, {
              method,
              headers: {
                'Content-Type': 'application/json',
                ...headers,
              },
              body: body ? JSON.stringify(body) : undefined,
              signal,
            });

            if (!response.ok) {
              // エラーレスポンスのボディをパースして詳細なエラーメッセージを取得
              let errorMessage = `HTTP error! status: ${response.status}`;
              try {
                const errorBody = await response.json();
                if (errorBody.message) {
                  errorMessage = errorBody.message;
                } else if (errorBody.error) {
                  errorMessage = errorBody.error;
                }
              } catch {
                // JSONパースに失敗した場合はデフォルトメッセージを使用
                try {
                  const text = await response.text();
                  if (text) {
                    errorMessage = text;
                  }
                } catch {
                  // テキスト取得にも失敗した場合はデフォルトメッセージを使用
                }
              }
              
              const error = new Error(errorMessage) as any;
              error.status = response.status;
              error.statusCode = response.status;
              throw error;
            }

            return response.json();
          },
          retry.maxAttempts,
          retry.delay,
          retry.backoff
        );

        // キャッシュに保存
        if (cache && method === 'GET') {
          this.cache.set(cacheKey, result, cacheTTL);
        }

        return result as T;
      } finally {
        // 完了したリクエストを削除
        this.pendingRequests.delete(cacheKey);
      }
    })();

    // 進行中のリクエストを記録
    this.pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }

  // 便利メソッド
  get<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  post<T>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...config, method: 'POST', body });
  }

  put<T>(url: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...config, method: 'PUT', body });
  }

  delete<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  // キャッシュのクリア
  clearCache(): void {
    this.cache.clear();
  }
  
  // #TODO: リクエストキューイング機能を追加（優先度付きキュー）
  // #TODO: オフライン対応: リクエストをキューに保存し、オンライン復帰時に実行
  // #TODO: リクエスト/レスポンスのインターセプター機能を追加
  // #TODO: リクエストのキャンセル機能を改善（特定のパターンでキャンセル可能に）
}

// シングルトンインスタンス
export const apiClient = new ApiClient(60, 5 * 60 * 1000);

