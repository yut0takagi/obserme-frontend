
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockApplications } from '../services/mockData';
import { useTasks } from '../context/TaskContext';
import { AddTaskModal } from '../components/AddTaskModal';
import { Card, Button, Badge, Modal, Select } from '../components/ui';
import { PageHeader, SectionHeader } from '../components/common';
import { ArrowLeft, Save, CheckCircle2, Circle, Plus, FileText, MessageSquare, Users, Edit3 } from 'lucide-react';
import { ApplicationMemo } from '../types';
import { groupTasksByApplicationId } from '../utils/dataOptimization';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  // #TODO: バックエンドAPIからアプリケーション詳細を取得
  // #TODO: ローディング状態とエラーハンドリングを追加
  // #TODO: メモの保存機能をAPIと統合
  // In a real app, this would come from a context or API.
  // We use local state here to simulate adding memos to the mock object
  const applicationData = mockApplications.find(a => a.id === id);
  const [application, setApplication] = useState(applicationData);
  
  const { tasks } = useTasks();
  
  // N+1問題の解決: タスクを一度だけグループ化
  const tasksByAppId = useMemo(() => groupTasksByApplicationId(tasks), [tasks]);
  const relatedTasks = useMemo(() => {
    if (!id) return [];
    return tasksByAppId.get(id) || [];
  }, [id, tasksByAppId]);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);

  // New Memo State
  const [memoType, setMemoType] = useState<ApplicationMemo['type']>('ES');
  const [memoTitle, setMemoTitle] = useState('');
  const [memoContent, setMemoContent] = useState('');

  if (!application) {
    return <div>Application not found</div>;
  }

  const handleOpenMemoModal = () => {
    setMemoType('ES');
    setMemoTitle('');
    setMemoContent(getTemplate('ES'));
    setIsMemoModalOpen(true);
  };

  const getTemplate = (type: ApplicationMemo['type']) => {
    switch(type) {
      case 'ES':
        return "志望動機: \n\n自己PR: \n\n学生時代に力を入れたこと (ガクチカ): \n";
      case '面接':
        return "聞かれた質問: \n1. \n2. \n\n逆質問: \n\n雰囲気: \n\n反省点: \n";
      case 'GD':
        return "テーマ: \n\n役割: \n\n議論の流れ: \n\n自分の貢献: \n\n反省点: \n";
      default:
        return "";
    }
  };

  const handleMemoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as ApplicationMemo['type'];
    setMemoType(newType);
    if (!memoContent || memoContent === getTemplate(memoType)) {
      setMemoContent(getTemplate(newType));
    }
  };

  const handleSaveMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    const newMemo: ApplicationMemo = {
      id: Math.random().toString(36).substr(2, 9),
      type: memoType,
      title: memoTitle || `${memoType}の記録`,
      content: memoContent,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Update local state (mock)
    const updatedApp = {
      ...application,
      memos: [newMemo, ...application.memos]
    };
    setApplication(updatedApp);
    
    // Reset and close
    setIsMemoModalOpen(false);
  };

  const getMemoIcon = (type: ApplicationMemo['type']) => {
    switch(type) {
      case 'ES': return <FileText className="w-5 h-5 text-blue-500" />;
      case '面接': return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'GD': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <Edit3 className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        description={
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <span className="text-lg font-semibold text-gray-900 dark:text-white truncate">{application.company}</span>
            <Badge color={application.status === '内定' ? 'green' : 'blue'}>{application.status}</Badge>
            {application.position && (
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{application.position}</span>
            )}
          </div>
        }
        actions={
          <Link to="/applications">
            <Button variant="secondary" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Memos */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader
            title="選考メモ"
            action={
              <Button size="sm" onClick={handleOpenMemoModal} className="flex items-center">
                <Plus className="w-4 h-4 mr-2 flex-shrink-0" /> <span className="truncate">メモを追加</span>
              </Button>
            }
          />

          <div className="space-y-4">
            {application.memos.length > 0 ? (
              application.memos.map(memo => (
                <Card key={memo.id} className="border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        {getMemoIcon(memo.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{memo.title}</h4>
                        <span className="text-xs text-gray-500">{memo.createdAt} • {memo.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pl-12">
                     <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                       {memo.content}
                     </p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-2">メモはまだありません</p>
                <Button variant="secondary" size="sm" onClick={handleOpenMemoModal}>最初のメモを作成</Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Tasks & Info */}
        <div className="space-y-6">
          <Card>
            <SectionHeader title="WBS / タスク" />
            <div className="space-y-3">
              {relatedTasks.length > 0 ? relatedTasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer group">
                  <div className="mt-0.5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {task.status === '完了' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${task.status === '完了' ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">期限: {task.dueDate}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500">関連タスクはありません。</p>
              )}
              <Button variant="secondary" size="sm" className="w-full mt-2" onClick={() => setIsTaskModalOpen(true)}>
                タスクを追加
              </Button>
            </div>
          </Card>

          <Card>
            <SectionHeader title="基本情報" />
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">更新日</span>
                <span className="font-medium text-gray-900 dark:text-white">{application.updatedAt}</span>
              </div>
              <div>
                <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">現在のフェーズ</span>
                <span className="font-medium text-gray-900 dark:text-white">{application.status}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <AddTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        defaultApplicationId={id} 
        defaultCategory="就活"
      />

      {/* Add Memo Modal */}
      <Modal isOpen={isMemoModalOpen} onClose={() => setIsMemoModalOpen(false)} title="メモを追加">
        <form onSubmit={handleSaveMemo} className="space-y-4">
          <Select 
            label="種類"
            value={memoType}
            onChange={handleMemoTypeChange}
            options={[
              { value: 'ES', label: 'エントリーシート (ES)' },
              { value: '面接', label: '面接記録' },
              { value: 'GD', label: 'グループディスカッション' },
              { value: 'その他', label: 'その他' },
            ]}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">タイトル</label>
            <input 
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
              placeholder={memoType === 'ES' ? 'ES下書き v1' : '一次面接の振り返り'}
              value={memoTitle}
              onChange={(e) => setMemoTitle(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">内容</label>
             <textarea 
               className="w-full min-h-[300px] p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm font-mono leading-relaxed"
               value={memoContent}
               onChange={(e) => setMemoContent(e.target.value)}
               placeholder="ここに内容を記述してください..."
               required
             />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <Button variant="secondary" onClick={() => setIsMemoModalOpen(false)} type="button">キャンセル</Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApplicationDetail;
