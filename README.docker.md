# Docker セットアップガイド

このプロジェクトをDockerで起動する方法を説明します。

## 前提条件

- Docker がインストールされていること
- Docker Compose がインストールされていること

## 環境変数の設定

`.env` ファイルを作成して、必要な環境変数を設定してください：

```bash
# API Keys
VITE_GEMINI_API_KEY=your_api_key_here

# API Versions (オプション)
VITE_API_VERSION_GEMINI=v1beta
VITE_API_VERSION_BACKEND=v2

# Feature Flags
VITE_ENABLE_DEBUG_MODE=true
```

詳細は `frontend/config/README.md` を参照してください。

## 開発環境での起動

開発環境（ホットリロード対応）で起動する場合：

```bash
docker-compose up frontend-dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## 本番環境での起動

本番環境（ビルド済み）で起動する場合：

```bash
docker-compose --profile production up frontend-prod
```

ブラウザで `http://localhost` にアクセスしてください。

## ビルドのみ実行

イメージをビルドするだけの場合：

```bash
# 開発環境用
docker build --target development -t obserme-frontend:dev .

# 本番環境用
docker build --target production --build-arg GEMINI_API_KEY=your_api_key -t obserme-frontend:prod .
```

## トラブルシューティング

### パーミッションエラーが発生する場合

以下のコマンドでコンテナを再起動して、Viteのキャッシュをクリアしてください：

```bash
# コンテナを停止
docker-compose down

# キャッシュをクリアして再ビルド
docker-compose build --no-cache frontend-dev

# コンテナを起動
docker-compose up frontend-dev
```

### Viteが古いファイルを参照している場合

コンテナ内でViteのキャッシュをクリア：

```bash
# コンテナに入る
docker-compose exec frontend-dev sh

# キャッシュを削除
rm -rf /app/.vite

# コンテナから出る
exit

# コンテナを再起動
docker-compose restart frontend-dev
```

### モジュール解決エラーが発生する場合

`EACCES: permission denied` エラーが発生した場合：

1. ホスト側のファイルパーミッションを確認
2. Dockerコンテナを再起動
3. 上記のキャッシュクリア手順を実行

## その他のコマンド

### コンテナの停止
```bash
docker-compose down
```

### ログの確認
```bash
docker-compose logs -f frontend-dev
```

### コンテナ内でコマンドを実行
```bash
docker-compose exec frontend-dev sh
```
