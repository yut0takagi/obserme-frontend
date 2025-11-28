
import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { useCourses } from '../context/CourseContext';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Clock, MapPin } from 'lucide-react';
import { Course } from '../types';

const Courses = () => {
  const { courses } = useCourses();

  // 時間割グリッド生成
  const periods = [1, 2, 3, 4, 5, 6];
  const days: Course['dayOfWeek'][] = ['月', '火', '水', '木', '金', '土'];

  const getCourseForCell = (day: string, period: number) => {
    return courses.find(c => c.dayOfWeek === day && c.period === period);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">履修・講義管理</h2>
           <p className="text-gray-500 dark:text-gray-400">時間割と授業資料を一元管理します。</p>
        </div>
        <Button className="flex items-center">
          <Plus className="w-4 h-4 mr-2" /> 講義を追加
        </Button>
      </div>

      {/* Timetable Section */}
      <Card className="overflow-hidden p-0 border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" /> 2023年 秋学期 時間割
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">時限</th>
                {days.map(day => (
                  <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {periods.map(period => (
                <tr key={period}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/30 text-center">
                    {period}
                  </td>
                  {days.map(day => {
                    const course = getCourseForCell(day, period);
                    return (
                      <td key={`${day}-${period}`} className="px-2 py-2 whitespace-normal align-top h-32 w-1/6">
                        {course ? (
                          <Link to={`/courses/${course.id}`} className="block h-full">
                            <div className={`h-full p-3 rounded-lg ${course.color || 'bg-gray-100 dark:bg-gray-700'} hover:opacity-80 transition-opacity border border-transparent hover:border-indigo-500 flex flex-col justify-between`}>
                              <div>
                                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 line-clamp-2">{course.name}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{course.professor}</p>
                              </div>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                                <MapPin className="w-3 h-3 mr-1" />
                                {course.room || '未定'}
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div className="h-full border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <Plus className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Course List Section (For Mobile or List View) */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">講義一覧</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {courses.map(course => (
             <Link key={course.id} to={`/courses/${course.id}`}>
               <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border border-gray-100 dark:border-gray-700">
                 <div className="flex justify-between items-start mb-2">
                    <Badge color="gray">{course.dayOfWeek}曜 {course.period}限</Badge>
                    <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded">
                      {course.credits} 単位
                    </span>
                 </div>
                 <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{course.name}</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" /> {course.professor}
                 </p>
                 {course.room && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" /> {course.room}
                    </p>
                 )}
               </Card>
             </Link>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
