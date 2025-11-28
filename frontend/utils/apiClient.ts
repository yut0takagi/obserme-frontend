/**
 * APIクライアント - レート制限、リトライ、キャッシュ、AbortController対応
 */

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

        // 最後の試行でない場合のみ待機
        if (attempt < maxAttempts) {
          const waitTime = backoff === 'exponential' 
            ? delay * Math.pow(2, attempt - 1)
            : delay * attempt;
          await this.sleep(waitTime);
        }
      }
    }

    throw lastError || new Error('Request failed');
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
    } = config;

    // キャッシュキーを生成
    const cacheKey = this.generateCacheKey(url, config);

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
            const response = await fetch(url, {
              method,
              headers: {
                'Content-Type': 'application/json',
                ...headers,
              },
              body: body ? JSON.stringify(body) : undefined,
              signal,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
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
}

// シングルトンインスタンス
export const apiClient = new ApiClient(60, 5 * 60 * 1000);

