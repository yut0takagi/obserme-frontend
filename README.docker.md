# Docker セットアップガイド

このプロジェクトをDockerで起動する方法を説明します。

## 前提条件

- Docker がインストールされていること
- Docker Compose がインストールされていること

## 環境変数の設定

`.env` ファイルを作成して、必要な環境変数を設定してください：

```bash
GEMINI_API_KEY=your_api_key_here
```

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

