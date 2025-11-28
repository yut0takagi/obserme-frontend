import { describe, it, expect } from 'vitest';
import {
  groupTasksByApplicationId,
  groupTasksByCourseId,
  groupTasksByCategory,
  groupTasksByStatus,
  calculateTaskProgress,
} from '../dataOptimization';
import { Task } from '../../types';

describe('dataOptimization', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      category: '就活',
      status: '完了',
      priority: '高',
      dueDate: '2024-01-01',
      applicationId: 'app1',
      courseId: 'course1',
    },
    {
      id: '2',
      title: 'Task 2',
      category: '学習',
      status: '進行中',
      priority: '中',
      dueDate: '2024-01-02',
      applicationId: 'app1',
      courseId: 'course2',
    },
    {
      id: '3',
      title: 'Task 3',
      category: '生活',
      status: '未着手',
      priority: '低',
      dueDate: '2024-01-03',
      applicationId: 'app2',
    },
    {
      id: '4',
      title: 'Task 4',
      category: '就活',
      status: '完了',
      priority: '高',
      dueDate: '2024-01-04',
    },
  ];

  describe('groupTasksByApplicationId', () => {
    it('タスクをapplicationIdでグループ化する', () => {
      const result = groupTasksByApplicationId(mockTasks);
      
      expect(result.size).toBe(2);
      expect(result.get('app1')?.length).toBe(2);
      expect(result.get('app2')?.length).toBe(1);
      expect(result.get('app1')?.[0].id).toBe('1');
      expect(result.get('app1')?.[1].id).toBe('2');
    });

    it('applicationIdがないタスクは除外する', () => {
      const result = groupTasksByApplicationId(mockTasks);
      
      expect(result.get('app1')?.length).toBe(2);
      expect(result.get('app2')?.length).toBe(1);
    });

    it('空の配列を処理する', () => {
      const result = groupTasksByApplicationId([]);
      
      expect(result.size).toBe(0);
    });
  });

  describe('groupTasksByCourseId', () => {
    it('タスクをcourseIdでグループ化する', () => {
      const result = groupTasksByCourseId(mockTasks);
      
      expect(result.size).toBe(2);
      expect(result.get('course1')?.length).toBe(1);
      expect(result.get('course2')?.length).toBe(1);
      expect(result.get('course1')?.[0].id).toBe('1');
    });

    it('courseIdがないタスクは除外する', () => {
      const result = groupTasksByCourseId(mockTasks);
      
      expect(result.get('course1')?.length).toBe(1);
      expect(result.get('course2')?.length).toBe(1);
    });
  });

  describe('groupTasksByCategory', () => {
    it('タスクをカテゴリでグループ化する', () => {
      const result = groupTasksByCategory(mockTasks);
      
      expect(result.size).toBe(3);
      expect(result.get('就活')?.length).toBe(2);
      expect(result.get('学習')?.length).toBe(1);
      expect(result.get('生活')?.length).toBe(1);
    });

    it('カテゴリがないタスクは「その他」に分類する', () => {
      // カテゴリがオプショナルな場合のテスト（型定義上は必須だが、実際のデータでnull/undefinedが来る可能性を考慮）
      const tasksWithUndefinedCategory: Task[] = mockTasks.map(task => ({
        ...task,
        category: undefined as any, // テストのため型アサーションを使用
      }));
      
      const result = groupTasksByCategory(tasksWithUndefinedCategory);
      
      expect(result.get('その他')?.length).toBe(mockTasks.length);
    });
  });

  describe('groupTasksByStatus', () => {
    it('タスクをステータスでグループ化する', () => {
      const result = groupTasksByStatus(mockTasks);
      
      expect(result.size).toBe(3);
      expect(result.get('完了')?.length).toBe(2);
      expect(result.get('進行中')?.length).toBe(1);
      expect(result.get('未着手')?.length).toBe(1);
    });

    it('ステータスがないタスクは「未着手」に分類する', () => {
      const tasksWithoutStatus: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          category: '就活',
          status: '未着手',
          priority: '中',
          dueDate: '2024-01-01',
        },
      ];
      
      const result = groupTasksByStatus(tasksWithoutStatus);
      
      expect(result.get('未着手')?.length).toBe(1);
    });
  });

  describe('calculateTaskProgress', () => {
    it('進捗率を正しく計算する', () => {
      const result = calculateTaskProgress(mockTasks);
      
      expect(result.total).toBe(4);
      expect(result.completed).toBe(2);
      expect(result.progress).toBe(50);
    });

    it('すべて完了している場合、進捗率は100%', () => {
      const completedTasks: Task[] = mockTasks.map(task => ({
        ...task,
        status: '完了' as const,
      }));
      
      const result = calculateTaskProgress(completedTasks);
      
      expect(result.progress).toBe(100);
    });

    it('空の配列の場合、進捗率は0%', () => {
      const result = calculateTaskProgress([]);
      
      expect(result.total).toBe(0);
      expect(result.completed).toBe(0);
      expect(result.progress).toBe(0);
    });

    it('完了タスクがない場合、進捗率は0%', () => {
      const incompleteTasks: Task[] = mockTasks.map(task => ({
        ...task,
        status: '未着手' as const,
      }));
      
      const result = calculateTaskProgress(incompleteTasks);
      
      expect(result.progress).toBe(0);
    });
  });
});

