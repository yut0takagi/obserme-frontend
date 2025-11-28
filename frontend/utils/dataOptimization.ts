/**
 * データ最適化ユーティリティ - N+1問題の解決
 * 
 * #TODO: 大量データ（1000件以上）への対応
 * - 仮想スクロールやページネーションとの統合
 * - メモ化の最適化（WeakMapの使用を検討）
 * - インデックス付きデータ構造の検討
 */

import { Task } from '../types';

/**
 * タスクをapplicationIdでグループ化（N+1問題の解決）
 */
export function groupTasksByApplicationId(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();
  
  for (const task of tasks) {
    if (task.applicationId) {
      const existing = grouped.get(task.applicationId) || [];
      existing.push(task);
      grouped.set(task.applicationId, existing);
    }
  }
  
  return grouped;
}

/**
 * タスクをcourseIdでグループ化
 */
export function groupTasksByCourseId(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();
  
  for (const task of tasks) {
    if (task.courseId) {
      const existing = grouped.get(task.courseId) || [];
      existing.push(task);
      grouped.set(task.courseId, existing);
    }
  }
  
  return grouped;
}

/**
 * タスクの進捗率を計算
 */
export function calculateTaskProgress(tasks: Task[]): {
  total: number;
  completed: number;
  progress: number;
} {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === '完了').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, progress };
}

/**
 * タスクをカテゴリでグループ化
 */
export function groupTasksByCategory(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();
  
  for (const task of tasks) {
    const category = task.category || 'その他';
    const existing = grouped.get(category) || [];
    existing.push(task);
    grouped.set(category, existing);
  }
  
  return grouped;
}

/**
 * タスクをステータスでグループ化
 */
export function groupTasksByStatus(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();
  
  for (const task of tasks) {
    const status = task.status || '未着手';
    const existing = grouped.get(status) || [];
    existing.push(task);
    grouped.set(status, existing);
  }
  
  return grouped;
}

// #TODO: タスクのソート機能を追加（期限、優先度、作成日時等）
// #TODO: タスクのフィルタリング機能を追加（複数条件の組み合わせ）
// #TODO: タスクの集計機能を追加（カテゴリ別、ステータス別の統計）
// #TODO: パフォーマンス最適化: 大量データの場合、Web Workerでの処理を検討

