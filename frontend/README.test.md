# テストガイド

このプロジェクトでは、Vitestを使用してユニットテストを実行します。

## セットアップ

依存関係をインストール：

```bash
npm install
```

## テストの実行

### すべてのテストを実行

```bash
npm test
```

### ウォッチモードで実行（ファイル変更時に自動実行）

```bash
npm test -- --watch
```

### UIモードで実行

```bash
npm run test:ui
```

### カバレッジレポートを生成

```bash
npm run test:coverage
```

## テストファイルの構成

テストファイルは、対象のソースファイルと同じディレクトリ構造で `__tests__` ディレクトリに配置されます。

```
frontend/
  utils/
    __tests__/
      errorHandler.test.ts
      dataOptimization.test.ts
      requestUtils.test.ts
      apiClient.test.ts
    errorHandler.ts
    dataOptimization.ts
    requestUtils.ts
    apiClient.ts
```

## テストカバレッジ

現在、以下のユーティリティのテストを実装しています：

- ✅ `errorHandler.ts`: エラーの分類とユーザーフレンドリーなメッセージ
- ✅ `dataOptimization.ts`: データのグループ化と進捗計算
- ✅ `requestUtils.ts`: デバウンス、スロットル、重複リクエスト防止
- ✅ `apiClient.ts`: APIリクエスト、キャッシュ、リトライ

## テストの書き方

### 基本的なテスト

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myModule';

describe('myFunction', () => {
  it('正常なケースを処理する', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('エラーケースを処理する', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### 非同期処理のテスト

```typescript
it('非同期処理をテストする', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### モックの使用

```typescript
import { vi } from 'vitest';

it('モックを使用する', () => {
  const mockFn = vi.fn();
  mockFn('arg');
  expect(mockFn).toHaveBeenCalledWith('arg');
});
```

## 今後の追加予定

- [ ] コンポーネントのテスト（React Testing Library）
- [ ] 統合テスト
- [ ] E2Eテスト（Playwright等）

