import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react() as any], // vitestとviteの型の不一致を回避
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/__tests__/**',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
        '**/index.tsx',
        '**/main.tsx',
        '**/App.tsx',
        '**/vite-env.d.ts',
        '**/vitest.setup.ts',
        '**/mockData.ts',
        '**/types.ts',
        '**/config/api-config.json',
        '**/config/README.md',
        '**/REFACTORING.md',
        '**/DESIGN_SYSTEM.md',
        '**/README.md',
        '**/README.test.md',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});

