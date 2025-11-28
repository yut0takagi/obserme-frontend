/**
 * データ最適化ユーティリティ - N+1問題の解決
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

