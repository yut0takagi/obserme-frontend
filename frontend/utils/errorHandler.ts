/**
 * エラーハンドリングユーティリティ
 * 統一的なエラー処理とユーザーフレンドリーなエラーメッセージを提供
 */

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  TIMEOUT = 'TIMEOUT',
  ABORT = 'ABORT',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
  retryable: boolean;
  userMessage: string;
}

/**
 * エラーを分類してAppErrorに変換
 */
export function classifyError(error: any): AppError {
  // AbortError
  if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
    return {
      type: ErrorType.ABORT,
      message: 'Request was aborted',
      originalError: error,
      retryable: false,
      userMessage: 'リクエストがキャンセルされました。',
    };
  }

  // ネットワークエラー
  if (error?.message?.includes('fetch') || error?.message?.includes('network') || error?.message?.includes('Failed to fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: error.message || 'Network error',
      originalError: error,
      retryable: true,
      userMessage: 'ネットワークエラーが発生しました。インターネット接続を確認して、もう一度お試しください。',
    };
  }

  // タイムアウトエラー
  if (error?.message?.includes('timeout') || error?.name === 'TimeoutError') {
    return {
      type: ErrorType.TIMEOUT,
      message: error.message || 'Request timeout',
      originalError: error,
      retryable: true,
      userMessage: 'リクエストがタイムアウトしました。もう一度お試しください。',
    };
  }

  // レート制限エラー
  if (
    error?.message?.includes('quota') ||
    error?.message?.includes('rate limit') ||
    error?.message?.includes('rate_limit') ||
    error?.status === 429
  ) {
    return {
      type: ErrorType.RATE_LIMIT,
      message: error.message || 'Rate limit exceeded',
      originalError: error,
      statusCode: 429,
      retryable: true,
      userMessage: 'APIのレート制限に達しました。しばらく待ってから再試行してください。',
    };
  }

  // HTTPステータスコードベースの分類
  if (error?.status || error?.statusCode || error?.response?.status) {
    const status = error.status || error.statusCode || error.response?.status;
    
    // 4xxエラー（クライアントエラー）
    if (status >= 400 && status < 500) {
      // 401 Unauthorized
      if (status === 401) {
        return {
          type: ErrorType.AUTHENTICATION,
          message: error.message || 'Authentication failed',
          originalError: error,
          statusCode: status,
          retryable: false,
          userMessage: '認証に失敗しました。ログインし直してください。',
        };
      }
      
      // 403 Forbidden
      if (status === 403) {
        return {
          type: ErrorType.AUTHORIZATION,
          message: error.message || 'Access forbidden',
          originalError: error,
          statusCode: status,
          retryable: false,
          userMessage: 'この操作を実行する権限がありません。',
        };
      }
      
      // 404 Not Found
      if (status === 404) {
        return {
          type: ErrorType.CLIENT,
          message: error.message || 'Resource not found',
          originalError: error,
          statusCode: status,
          retryable: false,
          userMessage: 'リソースが見つかりませんでした。',
        };
      }
      
      // 422 Validation Error
      if (status === 422) {
        return {
          type: ErrorType.VALIDATION,
          message: error.message || 'Validation error',
          originalError: error,
          statusCode: status,
          retryable: false,
          userMessage: '入力内容に誤りがあります。確認して再度お試しください。',
        };
      }
      
      // その他の4xxエラー
      return {
        type: ErrorType.CLIENT,
        message: error.message || `Client error: ${status}`,
        originalError: error,
        statusCode: status,
        retryable: false,
        userMessage: 'リクエストに問題があります。入力内容を確認してください。',
      };
    }
    
    // 5xxエラー（サーバーエラー）
    if (status >= 500) {
      return {
        type: ErrorType.SERVER,
        message: error.message || `Server error: ${status}`,
        originalError: error,
        statusCode: status,
        retryable: true,
        userMessage: 'サーバーエラーが発生しました。しばらく待ってから再試行してください。',
      };
    }
  }

  // Gemini API固有のエラー
  if (error?.message?.includes('API_KEY') || error?.message?.includes('api key')) {
    return {
      type: ErrorType.AUTHENTICATION,
      message: error.message || 'API key error',
      originalError: error,
      retryable: false,
      userMessage: 'APIキーの設定に問題があります。管理者にお問い合わせください。',
    };
  }

  // その他のエラー
  return {
    type: ErrorType.UNKNOWN,
    message: error?.message || 'Unknown error',
    originalError: error,
    retryable: false,
    userMessage: '予期しないエラーが発生しました。もう一度お試しください。',
  };
}

/**
 * エラーログを記録（開発環境では詳細、本番環境では簡潔に）
 */
export function logError(error: AppError, context?: string): void {
  const logData = {
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
    context,
    timestamp: new Date().toISOString(),
    // 開発環境でのみ詳細なエラー情報をログ
    ...(import.meta.env.DEV && {
      originalError: error.originalError,
      stack: error.originalError?.stack,
    }),
  };

  if (import.meta.env.DEV) {
    console.error('Error:', logData);
  } else {
    // 本番環境では簡潔にログ
    console.error(`[${error.type}] ${error.message}`, context ? `Context: ${context}` : '');
  }

  // #TODO: エラー追跡システム（Sentry等）への送信
  // if (error.type !== ErrorType.ABORT && error.type !== ErrorType.UNKNOWN) {
  //   trackError(error, context);
  // }
}

/**
 * エラーを処理してユーザーフレンドリーなメッセージを返す
 */
export function handleError(error: any, context?: string): AppError {
  const appError = classifyError(error);
  logError(appError, context);
  return appError;
}

/**
 * エラーメッセージを取得（ユーザー向け）
 */
export function getUserErrorMessage(error: any): string {
  const appError = classifyError(error);
  return appError.userMessage;
}

/**
 * エラーがリトライ可能かどうかを判定
 */
export function isRetryableError(error: any): boolean {
  const appError = classifyError(error);
  return appError.retryable;
}

