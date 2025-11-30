#!/usr/bin/env node

/**
 * TODOコメントを検索してJSON形式で出力するスクリプト
 * 使用方法: node .github/scripts/find-todos.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRONTEND_DIR = path.join(__dirname, '../../frontend');
const TODO_PATTERNS = [
  /\/\/\s*TODO\s*:?\s*(.+)/i,
  /\/\*\s*TODO\s*:?\s*(.+?)\*\//i,
  /#\s*TODO\s*:?\s*(.+)/i,
  /<!--\s*TODO\s*:?\s*(.+?)-->/i,
];

function findTodosInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const todos = [];

  lines.forEach((line, index) => {
    for (const pattern of TODO_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        const todoContent = match[1].trim();
        if (todoContent) {
          todos.push({
            file: path.relative(FRONTEND_DIR, filePath),
            line: index + 1,
            content: todoContent,
            fullLine: line.trim(),
          });
        }
      }
    }
  });

  return todos;
}

function findTodosInDirectory(dir) {
  const todos = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // node_modulesやcoverageなどのディレクトリをスキップ
      if (['node_modules', 'coverage', 'dist', '.git'].includes(file.name)) {
        continue;
      }
      todos.push(...findTodosInDirectory(fullPath));
    } else if (file.isFile()) {
      // TypeScript/JavaScriptファイルのみ処理
      if (/\.(ts|tsx|js|jsx)$/.test(file.name)) {
        try {
          todos.push(...findTodosInFile(fullPath));
        } catch (error) {
          console.error(`Error reading ${fullPath}:`, error.message);
        }
      }
    }
  }

  return todos;
}

// メイン処理
try {
  const todos = findTodosInDirectory(FRONTEND_DIR);
  console.log(JSON.stringify(todos, null, 2));
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

