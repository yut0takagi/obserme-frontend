
import React from 'react';
import { Card, Button, Badge } from '../components/ui';
import { StatCard, SectionHeader } from '../components/common';
import { useTasks } from '../context/TaskContext';
import { useDiary } from '../context/DiaryContext';
import { mockApplications, mockEvents } from '../services/mockData';
import { ArrowRight, CheckCircle2, Clock, CalendarDays, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MotivationGraph } from '../components/MotivationGraph';

const Dashboard = () => {
  const { tasks } = useTasks();
  const { entries } = useDiary();
  const pendingTasks = tasks.filter(t => t.status !== '完了');
  const recentApps = mockApplications.slice(0, 3);

  return (
    <div className="space-y-6 min-w-0">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg min-w-0">
        <div className="min-w-0 flex-1">
          {/* TODO: ユーザ名を動的に取得して表示 */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 break-words">おはようございます、太郎さん！ 👋</h2>
          <p className="text-sm sm:text-base text-indigo-100 opacity-90 break-words">今日は {pendingTasks.length} 個のタスクと {mockEvents.length} 件の予定があります。</p>
        </div>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <Link to="/tasks">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 border-none w-full sm:w-auto">スケジュールを確認</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Clock}
          label="未完了タスク"
          value={pendingTasks.length}
          iconColor="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="今週の完了数"
          value={12}
          iconColor="emerald"
        />
        <StatCard
          icon={CalendarDays}
          label="予定されている面接"
          value={2}
          iconColor="purple"
        />
      </div>

      {/* Motivation Graph Section */}
      <Card className="p-6">
        <SectionHeader
          title={
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>モチベーション推移 (過去2週間)</span>
            </div>
          }
          action={
            <Link to="/diary" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              日記を書く
            </Link>
          }
        />
        <div className="h-64">
           <MotivationGraph entries={entries} />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="h-full">
          <SectionHeader
            title="最近の選考状況"
            action={
              <Link to="/applications" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                すべて見る
              </Link>
            }
          />
          <div className="space-y-4">
            {recentApps.map(app => (
              <div key={app.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-100 dark:border-gray-700">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">{app.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{app.position}</p>
                </div>
                <Badge color={app.status === '内定' ? 'green' : app.status.includes('面接') ? 'blue' : 'gray'}>
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="h-full">
          <SectionHeader
            title="優先タスク"
            action={
              <Link to="/tasks" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                すべて見る
              </Link>
            }
          />
          <div className="space-y-4">
            {/* TODO: 優先タスクを動的に取得して表示 */}
            // 現在は暫定で4件表示
            {pendingTasks.slice(0, 4).map(task => (
              <div key={task.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                <div className={`w-2 h-2 mt-2 rounded-full ${task.priority === '高' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{task.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">期限: {task.dueDate}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
