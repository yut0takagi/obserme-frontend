import apiConfigJson from './api-config.json';

interface ApiVersionConfig {
  path: string;
  models?: Record<string, string>;
  endpoints: Record<string, string>;
}

interface ServiceConfig {
  baseUrl: string;
  versions: Record<string, ApiVersionConfig>;
  defaultVersion: string;
}

interface ApiConfig {
  services: Record<string, ServiceConfig>;
}

class ApiConfigManager {
  private config: ApiConfig;
  private versionOverrides: Record<string, string> = {};

  constructor(config: ApiConfig) {
    this.config = config;
    // 環境変数からバージョンオーバーライドを読み込み
    this.loadVersionOverrides();
    
    // #TODO: 設定のバリデーションを追加（必須フィールドのチェック、URL形式の検証等）
    // #TODO: 設定のホットリロード機能（開発環境でのみ）
  }

  private loadVersionOverrides(): void {
    // VITE_API_VERSION_GEMINI=v1 のような形式でバージョンを指定可能
    Object.keys(this.config.services).forEach(serviceName => {
      const envKey = `VITE_API_VERSION_${serviceName.toUpperCase()}`;
      const version = import.meta.env[envKey];
      if (version) {
        this.versionOverrides[serviceName] = version;
      }
    });
  }

  /**
   * サービス名とエンドポイント名から完全なURLを取得
   */
  getEndpoint(
    serviceName: string,
    endpointName: string,
    params?: Record<string, string>
  ): string {
    const service = this.config.services[serviceName];
    if (!service) {
      throw new Error(`設定エラー: サービス「${serviceName}」が見つかりません。api-config.jsonを確認してください。`);
    }

    // バージョンの決定（オーバーライド > デフォルト）
    const version = this.versionOverrides[serviceName] || service.defaultVersion;
    const versionConfig = service.versions[version];
    
    if (!versionConfig) {
      throw new Error(
        `設定エラー: サービス「${serviceName}」のバージョン「${version}」が見つかりません。api-config.jsonを確認してください。`
      );
    }

    const endpoint = versionConfig.endpoints[endpointName];
    if (!endpoint) {
      throw new Error(
        `設定エラー: サービス「${serviceName}」のバージョン「${version}」にエンドポイント「${endpointName}」が見つかりません。api-config.jsonを確認してください。`
      );
    }

    // パラメータの置換（例: {model} -> gemini-2.5-flash）
    let finalEndpoint = endpoint;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        finalEndpoint = finalEndpoint.replace(`{${key}}`, value);
      });
    }

    // 完全なURLを構築
    return `${service.baseUrl}${versionConfig.path}${finalEndpoint}`;
  }

  /**
   * ベースURLとパスを取得（相対パスでエンドポイントを構築する場合）
   */
  getBasePath(serviceName: string): string {
    const service = this.config.services[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found in config`);
    }

    const version = this.versionOverrides[serviceName] || service.defaultVersion;
    const versionConfig = service.versions[version];
    
    if (!versionConfig) {
      throw new Error(
        `Version ${version} not found for service ${serviceName}`
      );
    }

    return `${service.baseUrl}${versionConfig.path}`;
  }

  /**
   * モデル名を取得（Gemini用）
   */
  getModel(serviceName: string, modelType: string): string {
    const service = this.config.services[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const version = this.versionOverrides[serviceName] || service.defaultVersion;
    const versionConfig = service.versions[version];
    
    if (!versionConfig?.models?.[modelType]) {
      throw new Error(
        `Model ${modelType} not found for service ${serviceName} version ${version}`
      );
    }

    return versionConfig.models[modelType];
  }

  /**
   * バージョンを動的に変更（ランタイム）
   */
  setVersion(serviceName: string, version: string): void {
    const service = this.config.services[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    if (!service.versions[version]) {
      throw new Error(`Version ${version} not found for service ${serviceName}`);
    }
    this.versionOverrides[serviceName] = version;
  }

  /**
   * 現在のバージョンを取得
   */
  getVersion(serviceName: string): string {
    const service = this.config.services[serviceName];
    if (!service) return '';
    return this.versionOverrides[serviceName] || service.defaultVersion;
  }
}

// シングルトンインスタンス
export const apiConfig = new ApiConfigManager(apiConfigJson as ApiConfig);

// 環境変数の取得
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || defaultValue || '';
}

export const env = {
  geminiApiKey: getEnvVar('VITE_GEMINI_API_KEY', ''),
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8000'),
  features: {
    analytics: getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
    debugMode: getEnvVar('VITE_ENABLE_DEBUG_MODE', 'false') === 'true',
  },
};

// 開発環境でのみ環境変数をログ出力
if (import.meta.env.DEV) {
  console.log('Environment Config:', {
    apiVersions: Object.keys(apiConfigJson.services).reduce((acc, serviceName) => {
      acc[serviceName] = apiConfig.getVersion(serviceName);
      return acc;
    }, {} as Record<string, string>),
    geminiApiKey: env.geminiApiKey ? '***' : 'NOT SET',
    debugMode: env.features.debugMode,
  });
  
  // #TODO: 設定の検証結果をログ出力（無効な設定の警告等）
  // #TODO: 設定の変更を監視して自動リロード（開発環境のみ）
}

