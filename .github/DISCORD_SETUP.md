# Discord Webhook Setup Guide

このガイドでは、GitHub ActionsからDiscordへの通知を設定する方法を説明します。

## 1. Discord Webhookの作成

### Discordサーバーでの設定
1. 通知を受け取りたいDiscordチャンネルを開く
2. チャンネル設定（歯車アイコン）をクリック
3. 「連携サービス」→「ウェブフック」を選択
4. 「新しいウェブフック」をクリック
5. ウェブフックに名前を付ける（例: "GitHub Notifications"）
6. 「ウェブフックURLをコピー」をクリック

## 2. GitHubリポジトリでの設定

### シークレットの追加
1. GitHubリポジトリのページを開く
2. 「Settings」タブをクリック
3. 左サイドバーの「Secrets and variables」→「Actions」を選択
4. 「New repository secret」をクリック
5. 以下の情報を入力：
   - Name: `DISCORD_WEBHOOK_URL`
   - Secret: コピーしたDiscord Webhook URL
6. 「Add secret」をクリック

## 3. 通知の種類

このリポジトリでは以下のイベントでDiscord通知が送信されます：

### Push通知（全ブランチ）
- トリガー: すべてのブランチへのpush
- 通知内容:
  - ブランチ名
  - コミットメッセージ
  - 作成者
  - コミットへのリンク

### Pull Request通知
- トリガー:
  - PR作成（opened）
  - PR再オープン（reopened）
  - PRクローズ/マージ（closed/merged）
  - PRレビュー（submitted）
    - 承認（approved）✅
    - 変更要求（changes_requested）🔧
    - コメントのみ（commented）💬
  - レビューコメント（pull_request_review_comment）
  - PRコメント（issue_comment on PR）

## 4. トラブルシューティング

### 通知が届かない場合
1. Discord Webhook URLが正しく設定されているか確認
2. GitHubのActionsタブで実行ログを確認
3. Discord側でWebhookが削除されていないか確認

### Webhook URLの更新
1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」
2. `DISCORD_WEBHOOK_URL`を選択
3. 「Update secret」で新しいURLに更新

## 5. カスタマイズ

通知の内容やフォーマットをカスタマイズする場合は、以下のファイルを編集してください：
- `.github/workflows/discord-notify-push.yml` - Push通知
- `.github/workflows/discord-notify-pr.yml` - PR関連通知

### 通知の色について
- 青（3447003）: Push, 一般的な通知
- 緑（3066993）: PR作成, 承認
- オレンジ（15105570）: 変更要求
- パープル（9807270）: コメント
- 赤（15158332）: PRクローズ（マージなし）
- ダークグリーン（5763719）: PRマージ
