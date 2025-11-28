# コントリビューションガイドライン

ObserMeへの貢献にご興味をお持ちいただき、ありがとうございます！このドキュメントでは、プロジェクトへの貢献方法を説明します。

## 行動規範

このプロジェクトは、すべての貢献者に対して友好的で歓迎的な環境を提供することを目指しています。詳細については、[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)を参照してください。

## 貢献の方法

### バグレポート

バグを発見した場合は、[Issue](https://github.com/yut0takagi/obserme-frontend/issues/new?template=bug_report.md)を作成してください。以下の情報を含めてください：

- バグの明確な説明
- 再現手順
- 期待される動作と実際の動作
- スクリーンショット（該当する場合）
- 環境情報（OS、ブラウザ、Node.jsバージョンなど）

### 機能リクエスト

新機能のアイデアがある場合は、[Issue](https://github.com/yut0takagi/obserme-frontend/issues/new?template=feature_request.md)を作成してください。以下の情報を含めてください：

- 機能の詳細な説明
- その機能が解決する問題
- 実装の優先度

### プルリクエスト

1. **フォークとブランチ作成**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **変更の実装**
   - コードスタイルに従ってください
   - テストを追加・更新してください
   - ドキュメントを更新してください

3. **コミット**
   - 明確で説明的なコミットメッセージを使用してください
   - [Conventional Commits](https://www.conventionalcommits.org/)の形式を推奨します

4. **プッシュとプルリクエスト**
   ```bash
   git push origin feature/your-feature-name
   ```
   - [プルリクエストテンプレート](.github/pull_request_template.md)に従ってください

## 開発環境のセットアップ

### 必要な環境

- Node.js 20以上
- npm または yarn
- Docker（オプション）

### セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/yut0takagi/obserme-frontend.git
   cd obserme-frontend
   ```

2. **依存関係のインストール**
   ```bash
   cd frontend
   npm install
   ```

3. **環境変数の設定**
   ```bash
   cp .env.example .env
   # .envファイルを編集して必要な環境変数を設定
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

詳細については、[README.md](README.md)を参照してください。

## コーディング規約

### TypeScript

- TypeScriptの型を適切に使用してください
- `any`型の使用は避けてください
- 関数や変数には明確な型注釈を付けてください

### スタイル

- ESLintとPrettierの設定に従ってください
- コンポーネント名はPascalCaseを使用してください
- ファイル名はPascalCase（コンポーネント）またはcamelCase（ユーティリティ）を使用してください

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/)の形式を推奨します：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの動作に影響しない変更（フォーマットなど）
- `refactor`: バグ修正や機能追加を伴わないコード変更
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

## テスト

- 新しい機能にはテストを追加してください
- 既存のテストがすべて通過することを確認してください
- カバレッジを維持・向上させてください

```bash
npm test
npm run test:coverage
```

## ドキュメント

- コードにコメントを追加してください（特に複雑なロジック）
- READMEやその他のドキュメントを更新してください
- APIの変更がある場合は、ドキュメントを更新してください

## レビュープロセス

1. プルリクエストを作成すると、自動的にCIが実行されます
2. メンテナーがレビューを行います
3. フィードバックに基づいて変更を加えてください
4. 承認後、メンテナーがマージします

## 質問

質問がある場合は、[Discussions](https://github.com/yut0takagi/obserme-frontend/discussions)で質問してください。

## ライセンス

このプロジェクトへの貢献により、あなたの貢献は[MIT License](LICENSE)の下でライセンスされることに同意したものとみなされます。

---

ご協力ありがとうございます！🎉

