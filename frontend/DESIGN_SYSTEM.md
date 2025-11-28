# デザインシステム

## 概要

Obsermeフロントエンドの統一されたデザインシステムです。一貫性のあるUI/UXを提供するためのガイドラインとコンポーネントを定義しています。

## カラーパレット

### プライマリカラー
- **Indigo-600** (`#4f46e5`): メインカラー、ボタン、リンク、アクセント
- **Indigo-700** (`#4338ca`): ホバー状態
- **Indigo-100** (`#e0e7ff`): 背景、バッジ
- **Indigo-900** (`#312e81`): ダークモード背景

### セマンティックカラー
- **Success (Emerald)**: 成功、完了状態
- **Warning (Amber)**: 警告、注意が必要な状態
- **Error (Red)**: エラー、危険な状態
- **Info (Blue)**: 情報、通知

## タイポグラフィ

### フォント
- **フォントファミリー**: Inter
- **ウェイト**: 300, 400, 500, 600, 700

### フォントサイズ
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)

### 使用例
- **ページタイトル**: `text-xl sm:text-2xl font-bold`
- **セクションタイトル**: `text-lg font-bold`
- **本文**: `text-sm sm:text-base`
- **キャプション**: `text-xs`

## スペーシング

### 標準スペーシング
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

### グリッドシステム
- **カード間隔**: `gap-6` (24px)
- **セクション間隔**: `space-y-6` (24px)
- **ページパディング**: `p-4 sm:p-6` (レスポンシブ)

## コンポーネント

### PageHeader
ページのヘッダーコンポーネント。タイトル、説明、アクションボタンを統一して表示します。

```tsx
<PageHeader
  title="ページタイトル"
  description="ページの説明"
  icon={IconComponent}
  actions={<Button>アクション</Button>}
/>
```

### SectionHeader
セクションのヘッダーコンポーネント。タイトルとアクションボタンを表示します。

```tsx
<SectionHeader
  title="セクションタイトル"
  action={<Button>アクション</Button>}
/>
```

### StatCard
統計情報を表示するカードコンポーネント。

```tsx
<StatCard
  icon={Clock}
  label="未完了タスク"
  value={10}
  iconColor="blue"
/>
```

## レスポンシブデザイン

### ブレークポイント
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### レスポンシブパターン
- **モバイルファースト**: 小さい画面から設計
- **flexbox**: レイアウトの柔軟性を確保
- **min-w-0**: flexboxでのテキスト縮小を許可
- **truncate**: 長いテキストの省略表示

## アクセシビリティ

### キーボードナビゲーション
- すべてのインタラクティブ要素はキーボードで操作可能
- フォーカスリングを明確に表示

### ARIA属性
- モーダル: `role="dialog"`, `aria-modal="true"`
- ボタン: `aria-label`を適切に設定
- フォーム: `label`と`aria-describedby`を使用

## ダークモード

すべてのコンポーネントはダークモードに対応しています。

```tsx
// ライトモード
className="bg-white text-gray-900"

// ダークモード対応
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## ベストプラクティス

1. **一貫性**: 同じパターンは同じコンポーネントを使用
2. **レスポンシブ**: すべてのコンポーネントはレスポンシブ対応
3. **アクセシビリティ**: キーボード操作とスクリーンリーダーに対応
4. **パフォーマンス**: React.memoを使用して不要な再レンダリングを防止
5. **テキストオーバーフロー**: 長いテキストは`truncate`または`break-words`を使用

