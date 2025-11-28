
import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from './UI';
import { useTasks } from '../context/TaskContext';
import { useCourses } from '../context/CourseContext';
import { Task } from '../types';
import { CalendarRange, Calendar } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultApplicationId?: string; // 特定の選考に関連付ける場合
  defaultCourseId?: string; // 特定の授業に関連付ける場合
  defaultCategory?: Task['category'];
}

export const AddTaskModal = ({ isOpen, onClose, defaultApplicationId, defaultCourseId, defaultCategory }: AddTaskModalProps) => {
  const { addTask } = useTasks();
  const { courses } = useCourses();
  
  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Task['category']>('就活');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('中');
  const [courseId, setCourseId] = useState<string>('');
  
  // Toggle between Deadline only and Duration
  const [isRange, setIsRange] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory(defaultCategory || '就活');
      const today = new Date().toISOString().split('T')[0];
      setDueDate(today);
      setStartDate(today);
      setIsRange(false);
      setPriority('中');
      setCourseId(defaultCourseId || '');
    }
  }, [isOpen, defaultCategory, defaultCourseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title,
      category,
      startDate: isRange ? startDate : undefined,
      dueDate,
      priority,
      status: '未着手',
      applicationId: defaultApplicationId,
      courseId: category === '学習' ? courseId || undefined : undefined,
    });
    onClose();
  };

  const courseOptions = [
    { value: '', label: '授業を選択しない' },
    ...courses.map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="新規タスクを作成">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="タスク名" 
          required 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="例: レポートを提出する"
        />
        
        <Select
          label="カテゴリ"
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          options={[
            { value: '就活', label: '就活' },
            { value: '学習', label: '学習' },
            { value: '生活', label: '生活' },
          ]}
        />

        {category === '学習' && (
           <Select
             label="関連する授業（任意）"
             value={courseId}
             onChange={(e) => setCourseId(e.target.value)}
             options={courseOptions}
           />
        )}
        
        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">日付設定</label>
           <div className="flex items-center space-x-4 mb-3">
              <button 
                type="button"
                onClick={() => setIsRange(false)}
                className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center text-sm transition-colors ${
                  !isRange 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-400 dark:text-indigo-300' 
                    : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                期限のみ
              </button>
              <button 
                type="button"
                onClick={() => setIsRange(true)}
                className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center text-sm transition-colors ${
                  isRange 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-400 dark:text-indigo-300' 
                    : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                <CalendarRange className="w-4 h-4 mr-2" />
                期間を指定
              </button>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {isRange && (
                <Input 
                  label="開始日" 
                  type="date" 
                  required 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              )}
              <div className={isRange ? '' : 'col-span-2'}>
                <Input 
                  label={isRange ? "終了日 (期限)" : "期限"}
                  type="date" 
                  required 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                />
              </div>
           </div>
        </div>

        <Select
          label="優先度"
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          options={[
            { value: '高', label: '高' },
            { value: '中', label: '中' },
            { value: '低', label: '低' },
          ]}
        />

        <div className="pt-4 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} type="button">キャンセル</Button>
          <Button type="submit">追加</Button>
        </div>
      </form>
    </Modal>
  );
};
