# GitHub Actions Workflows

このディレクトリには、プロジェクトのCI/CDパイプラインを定義するGitHub Actionsワークフローが含まれています。

## ワークフロー一覧

### 1. CI (`ci.yml`)

メインのCIワークフロー。すべてのプッシュとプルリクエストで実行されます。

**実行内容:**
- ✅ Lint & Type Check: TypeScriptの型チェック
- ✅ Test: ユニットテストの実行
- ✅ Build: プロダクションビルドの確認
- ✅ Test Coverage: テストカバレッジの収集
- ✅ Docker Build: Dockerイメージのビルド確認

**トリガー:**
- `main`、`develop`、`feature/**`ブランチへのプッシュ
- プルリクエスト

### 2. CI - Pull Request (`ci-pr.yml`)

プルリクエスト専用のCIワークフロー。PRにコメントを追加します。

**実行内容:**
- Type check
- テスト実行
- ビルド確認
- PRへの結果コメント

**トリガー:**
- `main`、`develop`へのプルリクエスト

### 3. Code Quality (`code-quality.yml`)

コード品質チェックワークフロー。

**実行内容:**
- TODOコメントの検出
- console.logステートメントの検出
- 大きなファイルの検出
- 未使用の依存関係のチェック

**トリガー:**
- `main`、`develop`へのプッシュ
- プルリクエスト
- 毎週月曜日の定期実行

### 4. Release (`release.yml`)

リリースワークフロー。タグがプッシュされたときに実行されます。

**実行内容:**
- テスト実行
- プロダクションビルド
- GitHub Releaseの作成
- Dockerイメージのビルドとプッシュ

**トリガー:**
- `v*`タグへのプッシュ
- 手動実行（workflow_dispatch）

### 5. Discord Notification

既存のDiscord通知ワークフロー。

## 必要なSecrets

以下のSecretsをGitHubリポジトリに設定してください：

- `VITE_GEMINI_API_KEY`: Gemini APIキー（ビルド時に使用）
- `DISCORD_WEBHOOK_URL`: Discord通知用のWebhook URL（オプション）

## ローカルでの実行

CIワークフローをローカルで実行するには：

```bash
# テストの実行
cd frontend
npm test

# 型チェック
npx tsc --noEmit

# ビルド
npm run build
```

## トラブルシューティング

### CIが失敗する場合

1. **型エラー**: `npx tsc --noEmit`でローカルで確認
2. **テスト失敗**: `npm test`でローカルで確認
3. **ビルドエラー**: `npm run build`でローカルで確認

### キャッシュの問題

GitHub Actionsのキャッシュをクリアするには、ワークフローを再実行するか、キャッシュを手動で削除してください。

