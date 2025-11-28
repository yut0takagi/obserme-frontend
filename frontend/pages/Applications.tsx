
import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { mockApplications } from '../services/mockData';
import { useTasks } from '../context/TaskContext';
import { AddTaskModal } from '../components/AddTaskModal';
import { Badge, Button } from '../components/ui';
import { PageHeader } from '../components/common';
import { ChevronRight, ChevronDown, CheckCircle2, Circle, Plus, Briefcase, GripVertical, ZoomIn, ZoomOut, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Application } from '../types';
import { groupTasksByApplicationId, calculateTaskProgress } from '../utils/dataOptimization';

// Helper to check if two dates are the same day
const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const Applications = () => {
  const { tasks } = useTasks();
  
  // N+1問題の解決: タスクを一度だけグループ化
  const tasksByAppId = useMemo(() => groupTasksByApplicationId(tasks), [tasks]);
  
  // #TODO: バックエンドAPIからアプリケーション一覧を取得
  // #TODO: ローディング状態とエラーハンドリングを追加
  // #TODO: 無限スクロールでのデータ取得（ページネーション）
  // Local state for Applications to support optimistic updates for Gantt dragging
  const [localApps, setLocalApps] = useState<Application[]>(mockApplications);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    mockApplications.reduce((acc, app) => ({ ...acc, [app.id]: true }), {})
  );
  
  // View Mode State (Zoom Level)
  // 1日あたりのピクセル幅。20px(広域) 〜 100px(詳細)
  const [cellWidth, setCellWidth] = useState<number>(40);

  // --- Infinite Scroll State ---
  // 初期表示: 今日から30日前を開始点とし、合計90日分を表示
  const INITIAL_PAST_DAYS = 30;
  const INITIAL_TOTAL_DAYS = 90;

  const [timelineStartDate, setTimelineStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - INITIAL_PAST_DAYS);
    d.setHours(0,0,0,0);
    return d;
  });
  
  const [timelineDaysCount, setTimelineDaysCount] = useState<number>(INITIAL_TOTAL_DAYS);

  // Scroll Position Restoration Ref
  const prevScrollWidthRef = useRef<number>(0);
  const isPrepedingRef = useRef<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | undefined>(undefined);

  // Dragging State
  const [dragState, setDragState] = useState<{
    appId: string;
    type: 'move' | 'resize-left' | 'resize-right';
    startX: number;
    initialStartDate: string;
    initialEndDate: string;
  } | null>(null);

  // Scroll Refs for synchronization
  const headerRef = useRef<HTMLDivElement>(null);
  const chartBodyRef = useRef<HTMLDivElement>(null);
  const sidebarBodyRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddTaskModal = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    setSelectedAppId(appId);
    setIsModalOpen(true);
  };

  // --- Timeline Data Generation ---
  
  const timelineDates = useMemo(() => {
    const dates = [];
    const start = new Date(timelineStartDate);
    for (let i = 0; i < timelineDaysCount; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [timelineStartDate, timelineDaysCount]);

  // Group dates by month for the top header row
  const monthBlocks = useMemo(() => {
    const blocks: { year: number, month: number, count: number }[] = [];
    if (timelineDates.length === 0) return blocks;

    let currentBlock = {
      year: timelineDates[0].getFullYear(),
      month: timelineDates[0].getMonth(),
      count: 0
    };

    timelineDates.forEach((date, i) => {
      if (date.getFullYear() !== currentBlock.year || date.getMonth() !== currentBlock.month) {
        blocks.push(currentBlock);
        currentBlock = {
          year: date.getFullYear(),
          month: date.getMonth(),
          count: 1
        };
      } else {
        currentBlock.count++;
      }
    });
    blocks.push(currentBlock);
    return blocks;
  }, [timelineDates]);

  // Helper to calculate days diff from current timeline start
  const getDaysDiff = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setHours(0,0,0,0);
    const diffTime = date.getTime() - timelineStartDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper to add days to a string date
  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const getPositionStyle = (dateStr: string) => {
    const diffDays = getDaysDiff(dateStr);
    if (diffDays < 0 || diffDays >= timelineDaysCount) return null;

    return {
      left: `${diffDays * cellWidth}px`,
      width: `${cellWidth}px`
    };
  };

  const getRangeStyle = (startStr?: string, endStr?: string) => {
    if (!startStr || !endStr) return null;
    
    const startDiff = getDaysDiff(startStr);
    const endDiff = getDaysDiff(endStr);
    
    if (endDiff < 0 || startDiff >= timelineDaysCount) return null;

    const originalLeft = startDiff * cellWidth;
    const originalWidth = (endDiff - startDiff + 1) * cellWidth;
    
    return {
      left: `${originalLeft}px`,
      width: `${Math.max(cellWidth, originalWidth)}px`
    };
  };

  // --- Scroll Logic for Infinite Loading ---

  const handleChartScroll = () => {
    const chart = chartBodyRef.current;
    if (!chart) return;

    // Sync Header Scroll
    if (headerRef.current && headerRef.current.scrollLeft !== chart.scrollLeft) {
      headerRef.current.scrollLeft = chart.scrollLeft;
    }
    // Sync Sidebar Scroll (Vertical)
    if (sidebarBodyRef.current && sidebarBodyRef.current.scrollTop !== chart.scrollTop) {
      sidebarBodyRef.current.scrollTop = chart.scrollTop;
    }

    // Infinite Scroll Logic
    const { scrollLeft, scrollWidth, clientWidth } = chart;
    const THRESHOLD = 200; // px
    const DAYS_TO_ADD = 30;

    // 1. Expand to Past (Left)
    if (scrollLeft < THRESHOLD) {
      prevScrollWidthRef.current = scrollWidth;
      isPrepedingRef.current = true;
      
      setTimelineStartDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - DAYS_TO_ADD);
        return newDate;
      });
      setTimelineDaysCount(prev => prev + DAYS_TO_ADD);
    }
    // 2. Expand to Future (Right)
    else if (scrollLeft + clientWidth > scrollWidth - THRESHOLD) {
      setTimelineDaysCount(prev => prev + DAYS_TO_ADD);
    }
  };

  // Scroll Position Correction after Prepending Days
  useLayoutEffect(() => {
    if (isPrepedingRef.current && chartBodyRef.current) {
      const chart = chartBodyRef.current;
      const newScrollWidth = chart.scrollWidth;
      const diff = newScrollWidth - prevScrollWidthRef.current;
      
      if (diff > 0) {
        chart.scrollLeft += diff;
      }
      isPrepedingRef.current = false;
    }
  }, [timelineDates, cellWidth]);

  // Drag Handlers
  const handleDragStart = (e: React.MouseEvent, appId: string, type: 'move' | 'resize-left' | 'resize-right', startDate?: string, endDate?: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!startDate || !endDate) return;

    setDragState({
      appId,
      type,
      startX: e.clientX,
      initialStartDate: startDate,
      initialEndDate: endDate
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaDays = Math.round(deltaX / cellWidth);

      if (deltaDays === 0) return;

      setLocalApps(prevApps => prevApps.map(app => {
        if (app.id !== dragState.appId) return app;

        let newStartDate = app.startDate;
        let newEndDate = app.endDate;

        if (dragState.type === 'move') {
          newStartDate = addDays(dragState.initialStartDate, deltaDays);
          newEndDate = addDays(dragState.initialEndDate, deltaDays);
        } else if (dragState.type === 'resize-left') {
          const proposedStart = addDays(dragState.initialStartDate, deltaDays);
          // Prevent start > end
          if (new Date(proposedStart) <= new Date(dragState.initialEndDate)) {
             newStartDate = proposedStart;
             newEndDate = dragState.initialEndDate; 
          }
        } else if (dragState.type === 'resize-right') {
          const proposedEnd = addDays(dragState.initialEndDate, deltaDays);
          // Prevent end < start
          if (new Date(proposedEnd) >= new Date(dragState.initialStartDate)) {
             newEndDate = proposedEnd;
             newStartDate = dragState.initialStartDate;
          }
        }

        return {
          ...app,
          startDate: newStartDate,
          endDate: newEndDate
        };
      }));
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, cellWidth]);

  // Initial Scroll Position
  const scrollToToday = () => {
    const chart = chartBodyRef.current;
    if (!chart) return;
    
    // Find today's index
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = today.getTime() - timelineStartDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Center it roughly or place at 100px from left
    const scrollPos = Math.max(0, diffDays * cellWidth - 100);
    chart.scrollLeft = scrollPos;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToToday();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sync Sidebar -> Chart (Vertical)
  useEffect(() => {
    const sidebar = sidebarBodyRef.current;
    const chart = chartBodyRef.current;
    if (!sidebar || !chart) return;

    const handleSidebarScroll = () => {
       if (chart.scrollTop !== sidebar.scrollTop) {
         chart.scrollTop = sidebar.scrollTop;
       }
    };
    sidebar.addEventListener('scroll', handleSidebarScroll);
    return () => sidebar.removeEventListener('scroll', handleSidebarScroll);
  }, []);

  const todayStyle = getPositionStyle(new Date().toISOString().split('T')[0]);
  const now = new Date();

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden select-none">
      {/* Page Header */}
      <PageHeader
        actions={
          <div className="flex flex-wrap gap-2 items-center">
           {/* View Mode Slider */}
           <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 mr-2 shadow-sm">
              <ZoomOut className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="range" 
                min="20" 
                max="100" 
                step="5"
                value={cellWidth} 
                onChange={(e) => setCellWidth(Number(e.target.value))}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                title="表示ズーム"
              />
              <ZoomIn className="w-4 h-4 text-gray-400 ml-2" />
           </div>

           <Button variant="secondary" size="sm" onClick={scrollToToday} title="今日へ移動" className="px-3">
             <Target className="w-4 h-4" />
           </Button>

           <Link to="/tasks">
             <Button variant="secondary" className="hidden sm:flex">通常のタスクリストへ</Button>
           </Link>
           <Button className="flex items-center" onClick={() => {
              setSelectedAppId(undefined);
           }}>
             <Plus className="w-4 h-4 mr-2 flex-shrink-0" /> <span className="truncate">選考を追加</span>
           </Button>
          </div>
        }
      />

      {/* Main Split View */}
      <div className="flex flex-1 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm relative">
        
        {/* LEFT PANE: WBS LIST */}
        <div className="w-[300px] lg:w-[350px] flex flex-col border-r border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800 z-10">
           {/* Header (Fixed) matches Chart Header Height */}
           <div className="h-16 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex-shrink-0">
             プロジェクト / タスク
           </div>
           
           {/* List Body (Scrollable Vertical Only) */}
           <div 
             ref={sidebarBodyRef}
             className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
           >
              {localApps.map(app => {
                 // N+1問題の解決: 事前にグループ化されたタスクを取得
                 const appTasks = tasksByAppId.get(app.id) || [];
                 const isExpanded = expanded[app.id];
                 const { progress } = calculateTaskProgress(appTasks);

                 return (
                    <div key={app.id}>
                       {/* App Row */}
                       <div 
                         className="h-12 flex items-center px-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                         onClick={() => toggleExpand(app.id)}
                       >
                          <div className="mr-2 text-gray-400">
                             {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center">
                                <span className="font-bold text-gray-900 dark:text-white truncate mr-2">{app.company}</span>
                                <Badge color={app.status === '内定' ? 'green' : 'blue'}>{app.status}</Badge>
                             </div>
                             <div className="flex items-center text-xs mt-0.5">
                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mr-2">
                                  <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="text-gray-400">{progress}%</span>
                             </div>
                          </div>
                          <Link to={`/applications/${app.id}`} onClick={(e) => e.stopPropagation()}>
                             <Button size="sm" variant="ghost" className="p-1 h-6 w-6"><ChevronRight className="w-3 h-3" /></Button>
                          </Link>
                       </div>

                       {/* Task Rows */}
                       {isExpanded && (
                          <div className="bg-gray-50/50 dark:bg-gray-900/20">
                             {appTasks.map(task => (
                                <div key={task.id} className="h-10 flex items-center px-4 pl-10 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/30">
                                   <div className={`mr-2 ${task.status === '完了' ? 'text-green-500' : 'text-gray-300'}`}>
                                      {task.status === '完了' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                   </div>
                                   <span className={`text-sm truncate flex-1 ${task.status === '完了' ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                      {task.title}
                                   </span>
                                </div>
                             ))}
                             <div 
                                className="h-10 flex items-center px-4 pl-10 border-b border-gray-100 dark:border-gray-800 text-indigo-600 dark:text-indigo-400 text-xs cursor-pointer hover:underline"
                                onClick={(e) => openAddTaskModal(e, app.id)}
                             >
                                <Plus className="w-3 h-3 mr-1" /> タスクを追加
                             </div>
                          </div>
                       )}
                    </div>
                 );
              })}
           </div>
        </div>

        {/* RIGHT PANE: GANTT CHART */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800 relative">
           
           {/* Timeline Header (Sync Scroll Horizontal) */}
           <div 
             ref={headerRef}
             className="h-16 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden relative flex-shrink-0"
           >
              {/* Top Row: Year/Month (Grouped Blocks) */}
              <div className="flex h-8 absolute left-0 top-0 select-none border-b border-gray-100 dark:border-gray-800">
                  {monthBlocks.map((block, i) => (
                    <div 
                      key={`mb-${i}-${block.year}-${block.month}`} 
                      className="h-full flex items-center px-2 text-xs font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap border-l border-gray-300 dark:border-gray-600 first:border-l-0 overflow-hidden"
                      style={{ width: `${block.count * cellWidth}px` }}
                    >
                       <span className="sticky left-2">
                         {block.year}年 {block.month + 1}月
                       </span>
                    </div>
                  ))}
              </div>

              {/* Bottom Row: Days */}
              <div className="flex h-8 absolute left-0 bottom-0 select-none">
                 {timelineDates.map((date, i) => {
                    const isToday = isSameDay(date, now);
                    return (
                      <div 
                        key={i} 
                        className={`
                          flex flex-col items-center justify-center border-r border-gray-100 dark:border-gray-700 text-[10px] h-full
                          ${isToday 
                             ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200 font-bold border-yellow-200 dark:border-yellow-700' 
                             : date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}
                        `}
                        style={{ width: `${cellWidth}px` }}
                      >
                         <span className="font-bold">{date.getDate()}</span>
                         {cellWidth > 35 && (
                           <span className="text-[9px] scale-90">{['日','月','火','水','木','金','土'][date.getDay()]}</span>
                         )}
                      </div>
                    );
                 })}
              </div>
           </div>

           {/* Timeline Body (Scrollable Vertical & Horizontal) */}
           <div 
             ref={chartBodyRef}
             className="flex-1 overflow-auto relative"
             onScroll={handleChartScroll}
           >
              {/* Vertical Grid Lines (Background) */}
              <div className="absolute inset-0 pointer-events-none z-0 flex h-full" style={{ width: `${timelineDates.length * cellWidth}px` }}>
                 {timelineDates.map((date, i) => {
                    const isToday = isSameDay(date, now);
                    const isFirstDay = date.getDate() === 1;
                    return (
                      <div 
                         key={i} 
                         className={`border-r h-full flex-shrink-0 
                           ${isFirstDay ? 'border-l border-l-gray-300 dark:border-l-gray-600' : ''}
                           ${isToday 
                              ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30' 
                              : date.getDay() === 0 || date.getDay() === 6 
                                  ? 'bg-gray-50/30 dark:bg-gray-800/20 border-gray-100 dark:border-gray-700/50' 
                                  : 'border-gray-100 dark:border-gray-700/50'
                           }
                         `}
                         style={{ width: `${cellWidth}px` }}
                      />
                    );
                 })}
                 {/* Today Line */}
                 {todayStyle && (
                    <div className="absolute top-0 bottom-0 border-l-2 border-red-400 dark:border-red-500 z-10 opacity-50 pointer-events-none" style={{ left: todayStyle.left }}></div>
                 )}
              </div>

              {/* Rows */}
              <div className="relative z-10 pb-20" style={{ width: `${timelineDates.length * cellWidth}px` }}>
                 {localApps.map(app => {
                    // N+1問題の解決: 事前にグループ化されたタスクを取得
                    const appTasks = tasksByAppId.get(app.id) || [];
                    const isExpanded = expanded[app.id];
                    
                    // Use Application startDate/endDate for the bar range
                    const rangeStyle = getRangeStyle(app.startDate, app.endDate);

                    return (
                       <div key={app.id}>
                          {/* App Timeline Row (Editable) */}
                          <div className="h-12 border-b border-gray-100 dark:border-gray-700 relative group">
                             {rangeStyle && (
                                <div 
                                  className="absolute top-3 h-6 bg-indigo-200 dark:bg-indigo-900/60 rounded-full border border-indigo-300 dark:border-indigo-700 opacity-90 cursor-move group hover:bg-indigo-300 dark:hover:bg-indigo-800 transition-colors"
                                  style={rangeStyle}
                                  onMouseDown={(e) => handleDragStart(e, app.id, 'move', app.startDate, app.endDate)}
                                >
                                    {/* Resize Handle Left */}
                                    <div 
                                        className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-indigo-400 dark:hover:bg-indigo-500 rounded-l-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        onMouseDown={(e) => handleDragStart(e, app.id, 'resize-left', app.startDate, app.endDate)}
                                    >
                                        <div className="w-1 h-3 bg-white/50 rounded-full"></div>
                                    </div>
                                    
                                    {/* Drag Grip (Center) */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-50 pointer-events-none">
                                        <GripVertical className="w-4 h-4 text-indigo-700 dark:text-indigo-300" />
                                    </div>

                                    {/* Resize Handle Right */}
                                    <div 
                                        className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-indigo-400 dark:hover:bg-indigo-500 rounded-r-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        onMouseDown={(e) => handleDragStart(e, app.id, 'resize-right', app.startDate, app.endDate)}
                                    >
                                        <div className="w-1 h-3 bg-white/50 rounded-full"></div>
                                    </div>
                                </div>
                             )}
                          </div>

                          {/* Task Timeline Rows (Milestones) */}
                          {isExpanded && (
                             <>
                                {appTasks.map(task => {
                                   const pos = getPositionStyle(task.dueDate);
                                   return (
                                      <div key={task.id} className="h-10 border-b border-gray-100 dark:border-gray-800 relative hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                         {pos && (
                                            <div 
                                               className={`absolute top-2.5 w-5 h-5 rotate-45 border-2 shadow-sm flex items-center justify-center transform -translate-x-1/2 ml-[20px] z-20
                                                  ${task.status === '完了' 
                                                     ? 'bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-400' 
                                                     : 'bg-indigo-100 border-indigo-500 dark:bg-indigo-900 dark:border-indigo-400'
                                                  }`}
                                               style={{ left: pos.left }}
                                               title={`期限: ${task.dueDate}`}
                                            >
                                               {task.priority === '高' && <div className="w-1.5 h-1.5 bg-red-500 rounded-full transform -rotate-45" />}
                                            </div>
                                         )}
                                      </div>
                                   );
                                })}
                                {/* Spacer for "Add Task" row */}
                                <div className="h-10 border-b border-gray-100 dark:border-gray-800"></div>
                             </>
                          )}
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>
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

export default Applications;
