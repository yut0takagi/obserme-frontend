import React from 'react';
import { Card, Button } from '../components/ui';
import { PageHeader, SectionHeader } from '../components/common';
import { mockEvents } from '../services/mockData';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';

const CalendarPage = () => {
  // Mock calendar grid for visualization
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-col md:flex-row h-full md:h-[calc(100vh-200px)] gap-6">
        {/* Calendar Grid */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-w-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">2023年 11月</h2>
            <div className="flex space-x-2 flex-shrink-0">
              <Button variant="secondary" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="secondary" size="sm"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 flex-1">
          {weekDays.map(day => (
            <div key={day} className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">{day}</div>
          ))}
          {days.map((day, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-2 min-h-[80px] hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer relative transition-colors">
              <span className={`text-sm ${day === 15 ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700 dark:text-gray-300'}`}>
                {day <= 30 ? day : ''}
              </span>
              {/* Mock event placement */}
              {day === 16 && (
                <div className="mt-1 text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 p-1 rounded truncate">面接</div>
              )}
              {day === 20 && (
                <div className="mt-1 text-xs bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200 p-1 rounded truncate">締切</div>
              )}
            </div>
          ))}
        </div>
      </div>

        {/* Side List */}
        <div className="w-full md:w-80 space-y-4 flex-shrink-0">
          <Card className="h-full overflow-y-auto">
            <SectionHeader title="今後の予定" />
          <div className="space-y-4">
            {mockEvents.map(event => (
              <div key={event.id} className="flex gap-3 items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                <div className="flex flex-col items-center min-w-[3rem] bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-2">
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase">{event.date.split('-')[1]}/</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{event.date.split('-')[2]}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.time}
                  </div>
                  <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full ${
                    event.type === '締切' 
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200' 
                      : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                  }`}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;