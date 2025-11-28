
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Briefcase, 
  Calendar, 
  Settings, 
  User, 
  Image as ImageIcon,
  Mic,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  ListTree,
  MessageSquare,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ChatSidebar } from './ChatSidebar';

const SidebarItem = ({ to, icon: Icon, label, end = false }: { to: string, icon: any, label: string, end?: boolean }) => {
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => `
        flex items-center px-4 py-3 mb-1 text-sm font-medium rounded-lg transition-colors
        ${isActive 
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </NavLink>
  );
};

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Simple mapping for page titles
  const getPageTitle = (path: string) => {
    if (path.startsWith('/applications/')) return '選考詳細';
    if (path.startsWith('/courses/')) return '講義詳細';
    if (path.startsWith('/settings')) return '設定';
    
    switch(path) {
      case '/dashboard': return 'ダッシュボード';
      case '/tasks': return 'タスク管理';
      case '/applications': return '選考管理 (WBS)';
      case '/courses': return '大学・履修';
      case '/calendar': return 'カレンダー';
      case '/diary': return '日記・振り返り';
      case '/image-editor': return '画像編集';
      case '/live-assistant': return 'ライブアシスタント';
      case '/profile': return 'プロフィール';
      default: return 'Obserme';
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 実際には認証トークンの削除などを行う
    navigate('/');
  };

  // Chatページなどはフルスクリーン（余白なし）で表示する
  const isFullScreenPage = location.pathname === '/live-assistant';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col z-20 flex-shrink-0">
        <div className="p-6 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Obserme</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-4 mt-4">概要</div>
          <SidebarItem to="/dashboard" icon={LayoutDashboard} label="ダッシュボード" />
          <SidebarItem to="/tasks" icon={CheckSquare} label="タスク" />
          <SidebarItem to="/applications" icon={Briefcase} label="選考管理" />
          <SidebarItem to="/courses" icon={GraduationCap} label="大学・履修" />
          <SidebarItem to="/calendar" icon={Calendar} label="カレンダー" />
          <SidebarItem to="/diary" icon={BookOpen} label="日記" />

          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-4 mt-8">AI ツール</div>
          {/* AI Chat is now in the header/right sidebar */}
          <SidebarItem to="/image-editor" icon={ImageIcon} label="画像編集" />
          <SidebarItem to="/live-assistant" icon={Mic} label="ライブアシスタント" />

          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-4 mt-8">設定</div>
          {/* Profile link removed from here, moved to bottom user area */}
          <SidebarItem to="/settings/integrations" icon={Settings} label="拡張機能・連携" />
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div 
            className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
            onClick={() => navigate('/profile')}
            title="プロフィールを表示"
          >
             <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
               JS
             </div>
             <div className="ml-3 overflow-hidden">
               <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">学生 太郎</p>
               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">プロプラン</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 z-10 transition-colors duration-200 shrink-0 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white capitalize truncate min-w-0 flex-1 mr-4">{getPageTitle(location.pathname)}</h1>
          
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <div className="relative hidden md:block mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="検索..." 
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 lg:w-56 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* AI Chat Toggle Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isChatOpen 
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              AIチャット
            </button>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
            </button>
          </div>
        </header>

        {/* Content Body + Right Sidebar */}
        <div className="flex-1 flex overflow-hidden relative min-w-0">
          <main className={`flex-1 overflow-hidden flex flex-col min-w-0 ${isFullScreenPage ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'}`}>
            <div className={`flex-1 min-w-0 ${isFullScreenPage ? '' : 'p-4 sm:p-6 overflow-auto'}`}>
              <div className={`min-w-0 ${isFullScreenPage ? 'h-full w-full' : 'max-w-7xl mx-auto h-full'}`}>
                <Outlet />
              </div>
            </div>
          </main>
          
          {/* Chat Sidebar */}
          {isChatOpen && (
            <>
              {/* モバイル用のオーバーレイ */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
                onClick={() => setIsChatOpen(false)}
                aria-hidden="true"
              />
              <div className="fixed sm:relative inset-y-0 right-0 w-full sm:w-80 lg:w-96 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-50 sm:z-30 transition-all duration-300 min-w-0 max-w-full shadow-xl sm:shadow-none">
                <ChatSidebar onClose={() => setIsChatOpen(false)} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
