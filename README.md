<div align="center">
  <h1>ObserMe Frontend</h1>
  <p>キャリアと生産性向上のためのAIアシスタントアプリケーション</p>
  
  [![CI](https://github.com/yut0takagi/obserme-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/yut0takagi/obserme-frontend/actions/workflows/ci.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
</div>

## 📖 概要

ObserMeは、就職活動、学習、生活管理を統合的にサポートするAIアシスタントアプリケーションです。タスク管理、選考管理、日記機能、AIチャットなど、学生のキャリア形成を包括的にサポートします。

## ✨ 主な機能

- 📋 **タスク管理**: ドラッグ&ドロップで直感的なタスク管理
- 🎯 **選考管理**: 企業ごとの選考進捗とスケジュール管理
- 📚 **学習管理**: 授業のスケジュールと課題管理
- 📝 **日記機能**: 振り返りとモチベーション管理
- 🤖 **AIチャット**: Gemini APIを活用したインテリジェントなアシスタント
- 🎨 **モダンUI**: レスポンシブデザインとダークモード対応

## 🚀 クイックスタート

### 必要な環境

- Node.js 20以上
- npm または yarn
- Docker（オプション）

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yut0takagi/obserme-frontend.git
cd obserme-frontend

# 依存関係のインストール
cd frontend
npm install
```

### 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定してください：

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_VERSION_GEMINI=v1beta
VITE_API_VERSION_BACKEND=v2
VITE_API_BASE_URL=http://localhost:8000
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 🐳 Dockerでの実行

Dockerを使用して簡単に起動できます。詳細は[README.docker.md](README.docker.md)を参照してください。

```bash
# 開発環境
docker-compose up frontend-dev

# 本番環境
docker-compose --profile production up frontend-prod
```

## 📁 プロジェクト構造

```
obserme-frontend/
├── frontend/                 # フロントエンドアプリケーション
│   ├── components/          # Reactコンポーネント
│   │   ├── ui/             # UIコンポーネント（Button, Card, Modal等）
│   │   └── common/         # 共通コンポーネント（PageHeader等）
│   ├── pages/              # ページコンポーネント
│   ├── utils/              # ユーティリティ関数
│   ├── config/             # 設定ファイル
│   ├── context/            # React Context
│   └── services/           # APIサービス
├── .github/                # GitHub Actionsワークフロー
├── Dockerfile              # Docker設定
└── docker-compose.yml      # Docker Compose設定
```

## 🧪 テスト

```bash
# テストの実行
npm test

# カバレッジ付きテスト
npm run test:coverage

# UIモードでテスト
npm run test:ui
```

詳細は[frontend/README.test.md](frontend/README.test.md)を参照してください。

## 🛠️ 開発

### コーディング規約

- TypeScriptを使用
- ESLintとPrettierでコードフォーマット
- [Conventional Commits](https://www.conventionalcommits.org/)に従ったコミットメッセージ

### リファクタリング

プロジェクトのリファクタリング方針については、[frontend/REFACTORING.md](frontend/REFACTORING.md)を参照してください。

### デザインシステム

UIコンポーネントとデザインシステムについては、[frontend/DESIGN_SYSTEM.md](frontend/DESIGN_SYSTEM.md)を参照してください。

## 📚 ドキュメント

- [Dockerセットアップガイド](README.docker.md)
- [テストガイド](frontend/README.test.md)
- [API設定ガイド](frontend/config/README.md)
- [リファクタリングドキュメント](frontend/REFACTORING.md)
- [デザインシステム](frontend/DESIGN_SYSTEM.md)

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細は[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください。

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

## 📝 ライセンス

このプロジェクトは[MIT License](LICENSE)の下でライセンスされています。

## 👥 コントリビューター

<!-- コントリビューターのリストを追加してください -->

## 🔗 リンク

- [Issues](https://github.com/yut0takagi/obserme-frontend/issues)
- [Discussions](https://github.com/yut0takagi/obserme-frontend/discussions)
- [Pull Requests](https://github.com/yut0takagi/obserme-frontend/pulls)

## 📧 連絡先・サポート

- **質問・ディスカッション**: [Discussions](https://github.com/yut0takagi/obserme-frontend/discussions)
- **バグレポート**: [Issues](https://github.com/yut0takagi/obserme-frontend/issues)
- **メール**: yutotkg.1040@gmail.com

詳細は[.github/SUPPORT.md](.github/SUPPORT.md)を参照してください。

## 📄 その他のドキュメント

- [CONTRIBUTING.md](CONTRIBUTING.md) - コントリビューションガイド
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - 行動規範
- [SECURITY.md](SECURITY.md) - セキュリティポリシー
- [LICENSE](LICENSE) - ライセンス

---

**Created By**: [髙木悠人](mailto:yutotkg.1040@gmail.com)  
**Last Updated**: 2025/11/28
