# リファクタリングドキュメント

このドキュメントは、Obsermeフロントエンドのリファクタリング内容と実装状況を記録しています。

## リファクタリングの目的

1. **分散処理への対応**: レート制限、リトライ、キャッシュの実装
2. **DoS攻撃対策**: レート制限、重複リクエスト防止、デバウンス・スロットル
3. **N+1問題の解決**: データの事前グループ化とuseMemoによる最適化
4. **非同期処理の改善**: AbortControllerによるリクエストキャンセル、エラーハンドリング

## 実装状況

### ✅ 1. APIクライアント (`frontend/utils/apiClient.ts`)

**実装内容**:
- ✅ レート制限（1分間に60リクエスト）
- ✅ リトライロジック（指数バックオフ）
- ✅ キャッシュ機能（デフォルト5分TTL）
- ✅ AbortController対応
- ✅ 重複リクエスト防止
- ✅ 新しいAPI設定システムとの統合

**使用例**:
```typescript
import { apiClient } from '../utils/apiClient';

// 基本的な使用
const data = await apiClient.get('/tasks');

// 新しい設定システムを使用
const data = await apiClient.get('', {
  service: 'backend',
  endpoint: 'tasks'
});

// リトライとキャッシュのカスタマイズ
const data = await apiClient.get('/tasks', {
  retry: { maxAttempts: 5, delay: 2000 },
  cache: true,
  cacheTTL: 10 * 60 * 1000 // 10分
});
```

### ✅ 2. リクエストユーティリティ (`frontend/utils/requestUtils.ts`)

**実装内容**:
- ✅ デバウンス関数
- ✅ スロットル関数
- ✅ 重複リクエスト防止（RequestDeduplicator）
- ✅ React用のデバウンス・スロットルフック
- ✅ AbortController管理（AbortControllerManager）

**使用例**:
```typescript
import { debounce, throttle, requestDeduplicator, abortControllerManager } from '../utils/requestUtils';

// デバウンス
const debouncedSearch = debounce((query: string) => {
  // 検索処理
}, 300);

// 重複リクエスト防止
const result = await requestDeduplicator.deduplicate('unique-key', async () => {
  return await fetch('/api/data');
});

// AbortController管理
const controller = abortControllerManager.getController('my-request');
```

**実装箇所**:
- ✅ `ChatSidebar.tsx`: AbortControllerManagerを使用
- ✅ `ImageEditor.tsx`: AbortControllerManagerを使用
- ✅ `gemini.ts`: requestDeduplicatorを使用

### ✅ 3. データ最適化 (`frontend/utils/dataOptimization.ts`)

**実装内容**:
- ✅ タスクをapplicationIdでグループ化
- ✅ タスクをcourseIdでグループ化
- ✅ タスクをカテゴリでグループ化
- ✅ タスクをステータスでグループ化
- ✅ 進捗率の計算

**使用例**:
```typescript
import { groupTasksByApplicationId, calculateTaskProgress } from '../utils/dataOptimization';

// N+1問題の解決: useMemoで一度だけグループ化
const tasksByAppId = useMemo(() => groupTasksByApplicationId(tasks), [tasks]);

// 進捗率の計算
const { total, completed, progress } = calculateTaskProgress(tasks);
```

**実装箇所**:
- ✅ `Applications.tsx`: useMemo + groupTasksByApplicationId
- ✅ `ApplicationWBS.tsx`: useMemo + groupTasksByApplicationId
- ✅ `ApplicationDetail.tsx`: useMemo + groupTasksByApplicationId

### ✅ 4. 非同期処理の改善

**AbortController対応**:
- ✅ `apiClient.ts`: signalパラメータのサポート
- ✅ `gemini.ts`: AbortSignalのチェックとエラーハンドリング
- ✅ `ChatSidebar.tsx`: AbortControllerManagerを使用したリクエストキャンセル
- ✅ `ImageEditor.tsx`: AbortControllerManagerを使用したリクエストキャンセル

**エラーハンドリング**:
- ✅ AbortErrorの適切な処理
- ✅ レート制限エラーの詳細なメッセージ
- ✅ リトライロジックでのエラー処理

### ✅ 5. API設定管理 (`frontend/config/`)

**実装内容**:
- ✅ 環境変数管理（`env.ts`）
- ✅ APIバージョン管理（`api-config.json`）
- ✅ バージョン切り替え機能
- ✅ ランタイムでのバージョン変更

**詳細**: `frontend/config/README.md` を参照

## パフォーマンス最適化

### useMemoの使用

以下のコンポーネントでuseMemoを使用してパフォーマンスを最適化：

1. **Applications.tsx**:
   - `tasksByAppId`: タスクのグループ化
   - `timelineDates`: タイムライン日付の計算
   - `monthBlocks`: 月ブロックの計算

2. **ApplicationWBS.tsx**:
   - `tasksByAppId`: タスクのグループ化

3. **ApplicationDetail.tsx**:
   - `tasksByAppId`: タスクのグループ化
   - `relatedTasks`: 関連タスクのフィルタリング

## セキュリティ対策

### DoS攻撃対策

1. **レート制限**: APIクライアントで1分間に60リクエストに制限
2. **重複リクエスト防止**: 同じリクエストが進行中の場合、既存のPromiseを返す
3. **デバウンス・スロットル**: 連続した呼び出しを制御

### エラーハンドリング

- ネットワークエラー: リトライロジックで自動復旧
- レート制限エラー: ユーザーに分かりやすいメッセージを表示
- AbortError: 適切に処理してエラーメッセージを表示しない

## ベストプラクティス

### API呼び出し

1. **apiClientを使用**: 直接fetchを使わず、apiClientを使用する
2. **AbortController**: 長時間実行されるリクエストにはAbortControllerを使用
3. **キャッシュ**: GETリクエストには適切なキャッシュを設定

### データ処理

1. **useMemo**: 計算コストが高い処理はuseMemoでメモ化
2. **事前グループ化**: N+1問題を避けるため、データを事前にグループ化
3. **重複防止**: 同じデータを複数回取得しないように注意

### 非同期処理

1. **クリーンアップ**: useEffectのクリーンアップでAbortControllerをabort
2. **エラーハンドリング**: すべての非同期処理でエラーハンドリングを実装
3. **ローディング状態**: 適切なローディング状態の管理

## エラーハンドリング

### 実装済み ✅

- **統一的なエラーハンドリング** (`frontend/utils/errorHandler.ts`)
  - エラーの分類（ネットワーク、認証、レート制限等）
  - ユーザーフレンドリーなエラーメッセージ
  - リトライ可能かどうかの判定
  - 環境に応じたログ出力（開発環境は詳細、本番環境は簡潔）

- **エラーハンドリングの適用箇所**
  - ✅ `apiClient.ts`: HTTPエラーの詳細な処理とリトライ判定
  - ✅ `gemini.ts`: Gemini APIエラーの分類とユーザーメッセージ
  - ✅ `ChatSidebar.tsx`: チャットエラーの処理
  - ✅ `ImageEditor.tsx`: 画像生成エラーの処理
  - ✅ `useLiveSession.ts`: ライブセッションエラーの処理
  - ✅ `config/env.ts`: 設定エラーのユーザーフレンドリーなメッセージ

## 今後の改善点

### 高優先度
- [x] 統一的なエラーハンドリングの実装
- [x] ユーザーフレンドリーなエラーメッセージ
- [x] HTTPステータスコードに基づくリトライ判定の改善
- [ ] エラー追跡システム（Sentry等）の統合
- [ ] タイムアウト設定の追加
- [ ] チャット機能のレート制限

### 中優先度
- [ ] パフォーマンスモニタリング（リクエスト時間、成功率等）
- [ ] オフライン対応（リクエストのキューイング）
- [ ] リクエスト/レスポンスのインターセプター機能
- [ ] 会話履歴の永続化
- [ ] ストリーミングレスポンスの対応（チャット）

### 低優先度
- [ ] 設定のホットリロード機能（開発環境）
- [ ] 大量データへの対応（仮想スクロール、ページネーション）
- [ ] Web Workerでのデータ処理
- [ ] リクエストキューイング（優先度付き）

## 機能追加提案

### 1. リクエスト管理の強化
- **リクエストキューイング**: 優先度付きキューでリクエストを管理
- **バッチリクエスト**: 複数のリクエストをまとめて送信
- **リクエストのスケジューリング**: 特定の時間にリクエストを実行

### 2. キャッシュ戦略の改善
- **キャッシュの無効化**: 特定の条件でキャッシュを自動無効化
- **キャッシュの優先度**: 重要度に応じたキャッシュの保持期間
- **オフラインキャッシュ**: Service Workerとの統合

### 3. エラーハンドリングの強化
- **エラーの分類**: ネットワークエラー、認証エラー、バリデーションエラー等
- **エラーの自動復旧**: 特定のエラーに対する自動リトライ
- **エラーレポート**: ユーザーへの詳細なエラー情報の提供

### 4. パフォーマンス最適化
- **リクエストの並列化**: 複数のリクエストを並列実行
- **データのプリフェッチ**: 予測されるリクエストの事前実行
- **レスポンスの圧縮**: 大きなレスポンスの圧縮対応

### 5. 開発者体験の向上
- **リクエストの可視化**: 開発ツールでのリクエストの可視化
- **モック機能**: 開発環境でのAPIモック
- **テストユーティリティ**: テスト用のヘルパー関数

## 参考資料

- [API設定管理](./config/README.md)
- [デザインシステム](./DESIGN_SYSTEM.md)

