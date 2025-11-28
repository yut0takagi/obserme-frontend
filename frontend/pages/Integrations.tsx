import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { PageHeader } from '../components/common';
import { Mail, Calendar, Video, MessageSquare, Check, Settings } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  connected: boolean;
}

const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'google-cal', name: 'Google Calendar', description: '予定を同期し、締切や面接のリマインダーを受け取ります。', icon: Calendar, color: 'text-blue-500 bg-blue-100', connected: true },
    { id: 'gmail', name: 'Gmail', description: '選考に関するメールを自動的にインポートします。', icon: Mail, color: 'text-red-500 bg-red-100', connected: false },
    { id: 'outlook', name: 'Outlook Calendar', description: 'Microsoft Outlookのカレンダーと同期します。', icon: Calendar, color: 'text-blue-600 bg-blue-100', connected: false },
    { id: 'zoom', name: 'Zoom', description: '面接の予定から自動的にミーティングURLを生成します。', icon: Video, color: 'text-blue-400 bg-blue-50', connected: false },
    { id: 'slack', name: 'Slack', description: 'タスクの更新やリマインダーをSlackに通知します。', icon: MessageSquare, color: 'text-purple-500 bg-purple-100', connected: true },
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, connected: !item.connected } : item
    ));
  };

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        description="外部ツールと連携して、ワークフローを自動化しましょう。"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <Card key={item.id} className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} dark:bg-opacity-20`}>
                   <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                  {item.connected ? (
                    <Badge color="green">連携済み</Badge>
                  ) : (
                    <Badge color="gray">未連携</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1">
              {item.description}
            </p>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <Button 
                variant={item.connected ? "secondary" : "primary"} 
                className="w-full"
                onClick={() => toggleConnection(item.id)}
              >
                {item.connected ? '設定解除' : '連携する'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integrations;