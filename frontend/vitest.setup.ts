import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
});

// グローバルなモック設定
global.fetch = global.fetch || (() => Promise.reject(new Error('fetch is not defined')));

