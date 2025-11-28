# Docker トラブルシューティングガイド

## EACCES: permission denied エラー

`EACCES: permission denied, open '/app/components/ui.tsx'` というエラーが発生した場合、以下の手順で解決できます。

### 解決方法

1. **コンテナを停止して再起動**

```bash
docker-compose down
docker-compose up --build frontend-dev
```

2. **Viteのキャッシュをクリア**

```bash
# コンテナに入る
docker-compose exec frontend-dev sh

# キャッシュを削除
rm -rf /app/.vite
rm -rf /app/node_modules/.vite

# コンテナから出る
exit

# コンテナを再起動
docker-compose restart frontend-dev
```

3. **完全にクリーンな状態から再ビルド**

```bash
# すべてのコンテナとボリュームを削除
docker-compose down -v

# キャッシュなしで再ビルド
docker-compose build --no-cache frontend-dev

# 起動
docker-compose up frontend-dev
```

### 原因

このエラーは通常、以下のいずれかが原因です：

1. **Viteのキャッシュ**: 古いファイル構造がキャッシュに残っている
2. **ファイルパーミッション**: Dockerコンテナ内のファイルパーミッションの問題
3. **モジュール解決**: Viteが古いパスを参照している

### 予防策

- ファイル構造を変更した後は、必ずViteのキャッシュをクリアする
- 定期的に `docker-compose down -v` でクリーンな状態から再ビルドする

