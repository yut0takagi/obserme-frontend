
import React, { useState } from 'react';
import { Card, Button, Modal, Input, Badge } from '../components/ui';
import { PageHeader } from '../components/common';
import { useDiary } from '../context/DiaryContext';
import { Plus, Trash2, Smile, Meh, Frown, Sparkles, BookOpen } from 'lucide-react';

const Diary = () => {
  const { entries, addEntry, deleteEntry } = useDiary();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [score, setScore] = useState(50);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput.split(',').map(t => t.trim()).filter(t => t !== '');
    addEntry({
      date,
      content,
      moodScore: score,
      tags
    });
    // Reset
    setContent('');
    setScore(50);
    setTagInput('');
    setIsModalOpen(false);
  };

  const getMoodIcon = (score: number) => {
    if (score >= 70) return <Smile className="w-6 h-6 text-green-500" />;
    if (score >= 40) return <Meh className="w-6 h-6 text-yellow-500" />;
    return <Frown className="w-6 h-6 text-red-500" />;
  };

  // Sort entries by date desc
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        // TODO: 日記の説明文を動的に取得して表示
        description="日々の活動やモチベーションを記録して、自己理解を深めましょう。"
        actions={
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" /> <span className="truncate">新規作成</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEntries.map((entry) => (
          <Card key={entry.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                   {getMoodIcon(entry.moodScore)}
                </div>
                <div>
                   <span className="block font-bold text-gray-900 dark:text-white">{entry.date}</span>
                   <span className="text-xs text-gray-500 dark:text-gray-400">Score: {entry.moodScore}</span>
                </div>
              </div>
              <button onClick={() => deleteEntry(entry.id)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 mb-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                {entry.content}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {entry.tags?.map((tag, i) => (
                <Badge key={i} color="gray">{tag}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="日記を書く">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="日付" 
            type="date" 
            required 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               今日の気分・モチベーション ({score})
            </label>
            <div className="flex items-center gap-4">
              <Frown className="w-5 h-5 text-gray-400" />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={score} 
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
              />
              <Smile className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">本文</label>
             <textarea 
               className="w-full min-h-[150px] p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
               placeholder="今日あったこと、感じたことを書きましょう..."
               required
               value={content}
               onChange={(e) => setContent(e.target.value)}
             />
          </div>

          <Input 
            label="タグ (カンマ区切り)" 
            placeholder="就活, 面接, 反省"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" className="flex items-center">
               <Sparkles className="w-4 h-4 mr-2" /> 保存する
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Diary;
