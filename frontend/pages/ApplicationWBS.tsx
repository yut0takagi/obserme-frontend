import React, { useState, useMemo } from 'react';
import { mockApplications } from '../services/mockData';
import { useTasks } from '../context/TaskContext';
import { AddTaskModal } from '../components/AddTaskModal';
import { Card, Badge, Button } from '../components/ui';
import { PageHeader } from '../components/common';
import { ChevronRight, ChevronDown, CheckCircle2, Circle, ListTree, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { groupTasksByApplicationId, calculateTaskProgress } from '../utils/dataOptimization';

const ApplicationWBS = () => {
  const { tasks } = useTasks();
  
  // N+1問題の解決: タスクを一度だけグループ化
  const tasksByAppId = useMemo(() => groupTasksByApplicationId(tasks), [tasks]);
  
  // 状態管理
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    mockApplications.reduce((acc, app) => ({ ...acc, [app.id]: true }), {})
  );
  
  // タスク追加用State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | undefined>(undefined);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddTaskModal = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    setSelectedAppId(appId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        actions={
          <Link to="/tasks">
            <Button variant="secondary" className="w-full sm:w-auto">通常のタスクリストへ</Button>
          </Link>
        }
      />

      <div className="space-y-4">
        {mockApplications.map(app => {
          const appTasks = tasksByAppId.get(app.id) || [];
          const isExpanded = expanded[app.id];
          const { progress } = calculateTaskProgress(appTasks);

          return (
            <Card key={app.id} className="p-0 overflow-hidden">
              {/* Header Row (Project/Application Level) */}
              <div 
                className="bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                onClick={() => toggleExpand(app.id)}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="text-gray-400 flex-shrink-0">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{app.company}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.position}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge color={app.status === '内定' ? 'green' : 'blue'}>{app.status}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end w-32">
                    <div className="flex justify-between w-full text-xs mb-1">
                      <span className="text-gray-500">進捗</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <Link to={`/applications/${app.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="secondary">詳細</Button>
                  </Link>
                </div>
              </div>

              {/* Tasks Rows */}
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                  {appTasks.length > 0 ? (
                    appTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 pl-12 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`cursor-pointer flex-shrink-0 ${task.status === '完了' ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>
                            {task.status === '完了' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                          </div>
                          <span className={`text-sm font-medium truncate ${task.status === '完了' ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs ${task.priority === '高' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                            {task.priority}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 w-24 text-right">{task.dueDate}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 pl-12 text-sm text-gray-400 italic">タスクはまだありません</div>
                  )}
                  <div className="p-2 pl-12">
                     <button 
                       className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                       onClick={(e) => openAddTaskModal(e, app.id)}
                     >
                       <Plus className="w-4 h-4 mr-1" /> タスクを追加
                     </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultApplicationId={selectedAppId}
        defaultCategory="就活"
      />
    </div>
  );
};

export default ApplicationWBS;