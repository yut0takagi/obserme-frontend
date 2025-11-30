# GitHub Actions ワークフロー

このディレクトリには、プロジェクトのCI/CDと自動化のためのGitHub Actionsワークフローが含まれています。

## ワークフロー一覧

### CI/CD

- **`ci.yml`** - メインのCIワークフロー（リント、型チェック、テスト、ビルド）
- **`ci-pr.yml`** - プルリクエスト用のCIワークフロー（PRコメント機能付き）
- **`code-quality.yml`** - コード品質チェック（ESLint、Prettier等）
- **`docker-build-test.yml`** - Dockerイメージのビルドとテスト
- **`release.yml`** - リリース自動化

### 通知

- **`discord-notify-push.yml`** - プッシュ時のDiscord通知
- **`discord-notify-pr.yml`** - プルリクエスト時のDiscord通知

### 自動化

- **`todo-to-issue.yml`** - TODOコメントからGitHub Issueを自動生成 ⭐ NEW

## TODO to Issue ワークフロー

### 概要

`todo-to-issue.yml`は、コード内のTODOコメントを検出して、自動的にGitHub Issueを作成するワークフローです。

### 動作

1. **トリガー**: 
   - `main`または`develop`ブランチへのプッシュ時
   - 手動実行（`workflow_dispatch`）

2. **検出対象**:
   - `frontend/`ディレクトリ内の`.ts`、`.tsx`、`.js`、`.jsx`ファイル
   - 以下のパターンのTODOコメント:
     - `// TODO: ...`
     - `/* TODO: ... */`
     - `# TODO: ...`
     - `<!-- TODO: ... -->`

3. **Issue作成**:
   - 各TODOコメントに対して1つのIssueを作成
   - 重複チェック（既存のIssueとタイトルが同じ場合はスキップ）
   - 自動ラベル付け（`todo`、`automated`、カテゴリ別ラベル）

4. **Issue内容**:
   - ファイルパスと行番号
   - TODOコメントの内容
   - ファイルへの直接リンク
   - コミットへのリンク
   - 優先度とカテゴリの自動推測

### カテゴリ自動判定

TODOコメントの内容から以下のカテゴリを自動判定します：

- **バグ**: `バグ`、`bug`、`fix`を含む場合
- **セキュリティ**: `セキュリティ`、`security`を含む場合
- **パフォーマンス**: `パフォーマンス`、`performance`を含む場合
- **機能追加**: 上記以外（デフォルト）

### 優先度自動判定

TODOコメントの内容から以下の優先度を自動判定します：

- **高**: `重要`、`critical`、`urgent`を含む場合
- **低**: `低`、`low`、`optional`を含む場合
- **中**: 上記以外（デフォルト）

### 使用方法

#### 自動実行

`main`または`develop`ブランチにプッシュすると自動的に実行されます。

#### 手動実行

1. GitHubリポジトリの「Actions」タブに移動
2. 「TODO to Issue」ワークフローを選択
3. 「Run workflow」ボタンをクリック
4. ブランチを選択して実行

### 注意事項

- 既存のIssueと重複しないように、タイトルで重複チェックを行います
- TODOコメントを削除すると、対応するIssueは自動的には削除されません（手動でクローズしてください）
- 大量のTODOコメントがある場合、一度に多くのIssueが作成される可能性があります

### カスタマイズ

ワークフローをカスタマイズする場合は、以下のファイルを編集してください：

- `.github/workflows/todo-to-issue.yml` - ワークフローの設定
- `.github/scripts/find-todos.js` - TODOコメント検索スクリプト
