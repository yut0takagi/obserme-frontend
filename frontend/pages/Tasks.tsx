
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { AddTaskModal } from '../components/AddTaskModal';
import { useTasks } from '../context/TaskContext';
import { Plus, Filter } from 'lucide-react';
import { Task } from '../types';

const Tasks = () => {
  const { tasks, updateTaskStatus } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const statuses: Task['status'][] = ['未着手', '進行中', '完了'];

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    // Firefox requires dataTransfer to be set
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    // Optional: Add a ghost image or styling
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && taskId === draggedTaskId) {
      updateTaskStatus(taskId, status);
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm" className="flex items-center">
            <Filter className="w-4 h-4 mr-2" /> フィルター
          </Button>
        </div>
        <Button className="flex items-center" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> 新規タスク
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {statuses.map(status => (
          <div 
            key={status} 
            className={`
              flex flex-col bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 h-full
              transition-colors duration-200
              ${draggedTaskId ? 'border-2 border-dashed border-gray-300 dark:border-gray-600' : 'border-2 border-transparent'}
            `}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 px-2 flex justify-between flex-shrink-0">
              {status}
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5 text-xs">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pb-2">
              {tasks.filter(t => t.status === status).map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="cursor-move transform transition-transform active:scale-95 active:opacity-80"
                >
                  <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <Badge color={task.category === '就活' ? 'blue' : task.category === '学習' ? 'green' : 'gray'}>
                        {task.category}
                      </Badge>
                      {task.priority === '高' && <span className="w-2 h-2 rounded-full bg-red-500" title="高優先度"></span>}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 select-none">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 select-none">期限: {task.dueDate}</p>
                  </Card>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                 <div className="h-20 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    ドロップして移動
                 </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Tasks;
