## ObserMe UI（ログイン含む）

> Repo名: `obserme-frontend`   
> Created By: [髙木悠人](<mailto:yutotkg.1040@gmail.com>)   
> Changed At: 2025/11/09
---

## セットアップと起動方法

### 方法1: Docker（推奨）

#### 必要な環境
- Docker
- Docker Compose

#### 起動

```bash
docker-compose up
```

初回起動時は依存関係のインストールに時間がかかります。
起動後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

#### 停止

```bash
docker-compose down
```

#### 本番用ビルド

```bash
docker build -t obserme-frontend -f frontend/Dockerfile frontend/
docker run -p 3000:3000 obserme-frontend
```

---

### 方法2: ローカル環境

#### 必要な環境
- Node.js 18以上
- pnpm（推奨）または npm

#### インストール

```bash
cd frontend
pnpm install
```

npmを使用する場合:
```bash
cd frontend
npm install
```

#### 開発サーバーの起動

```bash
cd frontend
pnpm dev
```

npmを使用する場合:
```bash
cd frontend
npm run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

#### その他のコマンド

- **ビルド**: `pnpm build` - 本番用にアプリケーションをビルド
- **本番起動**: `pnpm start` - ビルド後のアプリケーションを起動
- **Lint**: `pnpm lint` - コードの静的解析を実行

---

### Discord通知
GitHub ActionsによるDiscord通知が設定されています。
- Push通知（全ブランチ）
- Pull Request通知（作成、コメント、レビュー、承認）

セットアップ方法は [.github/DISCORD_SETUP.md](.github/DISCORD_SETUP.md) を参照してください。
