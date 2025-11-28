
import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/UI';
import { MapPin, Link as LinkIcon, Mail, Calendar, Edit3, Share2, Users, FileText, CheckCircle2, BookOpen, Save, X, Camera } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'connections' | 'shared'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Initial Mock Data
  const initialUser = {
    name: "学生 太郎",
    role: "情報工学部 • 2024年卒",
    bio: "フロントエンド開発とAIに興味があります。現在、就活中でWebエンジニアのポジションを探しています。React, TypeScript勉強中。",
    location: "東京都, 日本",
    email: "taro.student@university.edu",
    website: "github.com/taro-student",
    stats: {
      tasksCompleted: 142,
      studyHours: 320,
      courses: 12
    },
    skills: ["React", "TypeScript", "Tailwind CSS", "Python", "TOEIC 800"],
    interests: ["Web開発", "UI/UXデザイン", "機械学習", "スタートアップ"]
  };

  const [user, setUser] = useState(initialUser);
  const [editForm, setEditForm] = useState(initialUser);

  // Helper for comma-separated arrays
  const handleArrayChange = (field: 'skills' | 'interests', value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const startEditing = () => {
    setEditForm(user);
    setIsEditing(true);
    setActiveTab('overview'); // Switch to overview to show form
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm(user);
  };

  const saveProfile = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  const connections = [
    { id: 1, name: "佐藤 花子", role: "デザイン学部 • 2024年卒", mutual: 3 },
    { id: 2, name: "田中 健太", role: "経済学部 • 2023年卒", mutual: 1 },
    { id: 3, name: "鈴木 一郎", role: "工学研究科 • 修士1年", mutual: 5 },
  ];

  const sharedItems = [
    { id: 1, title: "アルゴリズム論_まとめノート.pdf", type: "Document", date: "2023-10-20", likes: 12 },
    { id: 2, title: "Web開発ロードマップ 2024", type: "Link", date: "2023-11-01", likes: 45 },
    { id: 3, title: "【面接対策】逆質問集", type: "Memo", date: "2023-11-15", likes: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative mb-20">
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl w-full relative group">
           {/* Cover Photo Edit Placeholder */}
           {isEditing && (
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                <Button variant="secondary" size="sm"><Camera className="w-4 h-4 mr-2" /> カバー画像を変更</Button>
             </div>
           )}
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-full p-1.5 shadow-lg relative group">
             <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 dark:text-indigo-300 overflow-hidden">
               {/* Avatar Placeholder */}
               {isEditing ? (
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                 </div>
               ) : (
                 "JS"
               )}
             </div>
          </div>
          <div className="mb-4 ml-4">
             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{isEditing ? editForm.name : user.name}</h2>
             <p className="text-gray-600 dark:text-gray-300">{isEditing ? editForm.role : user.role}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-8 flex space-x-3">
           {!isEditing ? (
             <>
                <Button variant="secondary" className="shadow-sm">
                  <Share2 className="w-4 h-4 mr-2" /> プロフィールを共有
                </Button>
                <Button className="shadow-sm" onClick={startEditing}>
                  <Edit3 className="w-4 h-4 mr-2" /> 編集
                </Button>
             </>
           ) : (
             <>
                <Button variant="secondary" onClick={cancelEditing}>
                  <X className="w-4 h-4 mr-2" /> キャンセル
                </Button>
                <Button onClick={saveProfile}>
                  <Save className="w-4 h-4 mr-2" /> 保存
                </Button>
             </>
           )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: '概要', icon: FileText },
            { id: 'connections', label: 'つながり', icon: Users },
            { id: 'shared', label: '共有アイテム', icon: Share2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
              `}
            >
              <tab.icon className={`
                -ml-0.5 mr-2 h-5 w-5
                ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
              `} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {isEditing ? (
                // EDIT MODE FORM
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">基本情報の編集</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        label="名前" 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                      />
                      <Input 
                        label="所属・肩書き" 
                        value={editForm.role} 
                        onChange={(e) => setEditForm({...editForm, role: e.target.value})} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">自己紹介</label>
                      <textarea 
                        className="w-full min-h-[100px] p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        label="場所" 
                        value={editForm.location} 
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})} 
                      />
                      <Input 
                        label="メールアドレス" 
                        value={editForm.email} 
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                      />
                      <Input 
                        label="Webサイト / ポートフォリオ" 
                        value={editForm.website} 
                        onChange={(e) => setEditForm({...editForm, website: e.target.value})} 
                      />
                    </div>

                    <div>
                      <Input 
                         label="スキル (カンマ区切り)" 
                         value={editForm.skills.join(', ')} 
                         onChange={(e) => handleArrayChange('skills', e.target.value)}
                         placeholder="React, TypeScript, ..."
                      />
                    </div>
                    <div>
                      <Input 
                         label="興味・関心 (カンマ区切り)" 
                         value={editForm.interests.join(', ')} 
                         onChange={(e) => handleArrayChange('interests', e.target.value)}
                         placeholder="Web開発, AI, ..."
                      />
                    </div>
                  </div>
                </Card>
              ) : (
                // VIEW MODE
                <>
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">自己紹介</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                      {user.bio}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" /> {user.location}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" /> {user.email}
                      </div>
                      <div className="flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2" /> {user.website}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" /> 2024年3月 卒業予定
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">スキル & 興味</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">スキルセット</p>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, i) => (
                            <Badge key={i} color="blue">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">興味・関心</p>
                        <div className="flex flex-wrap gap-2">
                          {user.interests.map((interest, i) => (
                            <Badge key={i} color="gray">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-3 gap-4">
                     <Card className="text-center py-6">
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{user.stats.tasksCompleted}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">完了タスク</p>
                     </Card>
                     <Card className="text-center py-6">
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{user.stats.studyHours}h</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">学習時間</p>
                     </Card>
                     <Card className="text-center py-6">
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{user.stats.courses}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">履修講義数</p>
                     </Card>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'connections' && (
             <div className="space-y-4">
                {connections.map(friend => (
                   <Card key={friend.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                         <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold mr-4">
                            {friend.name.charAt(0)}
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{friend.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{friend.role}</p>
                            <p className="text-xs text-gray-400 mt-1">共通のつながり: {friend.mutual}人</p>
                         </div>
                      </div>
                      <Button variant="secondary" size="sm">メッセージ</Button>
                   </Card>
                ))}
                <div className="text-center pt-4">
                   <Button variant="ghost">すべて見る</Button>
                </div>
             </div>
          )}

          {activeTab === 'shared' && (
             <div className="space-y-4">
                {sharedItems.map(item => (
                   <Card key={item.id} className="flex items-center justify-between hover:border-indigo-300 transition-colors cursor-pointer">
                      <div className="flex items-center">
                         <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 mr-4">
                            {item.type === 'Document' ? <FileText className="w-6 h-6" /> : 
                             item.type === 'Link' ? <LinkIcon className="w-6 h-6" /> : 
                             <BookOpen className="w-6 h-6" />}
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-3">
                               <span>{item.date}</span>
                               <span>•</span>
                               <span>{item.type}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center text-gray-400">
                         <span className="text-sm font-medium mr-1">{item.likes}</span>
                         <Users className="w-4 h-4" />
                      </div>
                   </Card>
                ))}
             </div>
          )}
        </div>

        {/* Right Sidebar (Suggestions / Ads / etc) */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">プロフィール完成度</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200">
                    85%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-gray-700">
                <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
               <li className="flex items-center text-green-500"><CheckCircle2 className="w-4 h-4 mr-2" /> 基本情報</li>
               <li className="flex items-center text-green-500"><CheckCircle2 className="w-4 h-4 mr-2" /> スキル登録</li>
               <li className="flex items-center text-gray-400"><div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div> ポートフォリオ連携</li>
            </ul>
          </Card>

          <Card>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">おすすめのつながり</h3>
            <div className="space-y-4">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="overflow-hidden">
                     <p className="text-sm font-bold text-gray-900 dark:text-white truncate">高橋 教授</p>
                     <p className="text-xs text-gray-500 truncate">情報工学部 学部長</p>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-auto text-indigo-600">+</Button>
               </div>
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="overflow-hidden">
                     <p className="text-sm font-bold text-gray-900 dark:text-white truncate">キャリアセンター</p>
                     <p className="text-xs text-gray-500 truncate">公式アカウント</p>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-auto text-indigo-600">+</Button>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
