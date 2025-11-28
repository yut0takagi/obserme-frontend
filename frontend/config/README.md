# API設定管理

このディレクトリには、APIエンドポイントとバージョン管理の設定ファイルが含まれています。

## ファイル構成

- `api-config.json`: APIサービスごとのエンドポイントとバージョン設定
- `env.ts`: 環境変数の管理とAPI設定管理クラス

## 使用方法

### 1. 環境変数の設定

プロジェクトルートに`.env`ファイルを作成し、以下の環境変数を設定してください：

```bash
# API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# API Versions (オプション - 指定しない場合はapi-config.jsonのdefaultVersionを使用)
VITE_API_VERSION_GEMINI=v1beta
VITE_API_VERSION_BACKEND=v2

# Feature Flags
VITE_ENABLE_DEBUG_MODE=true
```

### 2. API設定ファイルの編集

`api-config.json`でサービスごとのエンドポイントとバージョンを管理します。

新しいバージョンを追加する場合：

```json
{
  "services": {
    "gemini": {
      "versions": {
        "v1beta": { ... },
        "v2": {  // 新しいバージョンを追加
          "path": "/v2",
          "models": { ... },
          "endpoints": { ... }
        }
      },
      "defaultVersion": "v2"  // デフォルトバージョンを変更
    }
  }
}
```

### 3. コードでの使用

#### APIエンドポイントの取得

```typescript
import { apiConfig } from '../config/env';

// サービス名とエンドポイント名でURLを取得
const url = apiConfig.getEndpoint('backend', 'tasks');
// => "http://localhost:8000/api/v2/tasks"

// パラメータ付きエンドポイント
const url = apiConfig.getEndpoint('gemini', 'generateContent', { 
  model: 'gemini-2.5-flash' 
});
```

#### モデル名の取得（Gemini用）

```typescript
const modelName = apiConfig.getModel('gemini', 'image');
// => "gemini-2.5-flash-image"
```

#### バージョンの動的変更（開発用）

```typescript
// ランタイムでバージョンを変更
apiConfig.setVersion('gemini', 'v1');
```

#### apiClientでの使用

```typescript
import { apiClient } from '../utils/apiClient';

// 新しい方式: サービス名とエンドポイント名で指定
const tasks = await apiClient.get('', {
  service: 'backend',
  endpoint: 'tasks'
});

// 従来の方式: 相対URL（後方互換性あり）
const tasks = await apiClient.get('/tasks');
```

## バージョン管理のベストプラクティス

1. **デフォルトバージョンの設定**: `api-config.json`で各サービスの`defaultVersion`を設定
2. **環境変数でのオーバーライド**: 環境ごとに異なるバージョンを使用する場合は`.env`で指定
3. **段階的な移行**: 新しいバージョンに移行する際は、まず設定ファイルに追加し、動作確認後にデフォルトを変更

