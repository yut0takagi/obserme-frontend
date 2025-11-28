
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { useTasks } from '../context/TaskContext';
import { Card, Button, Badge } from '../components/ui';
import { PageHeader, SectionHeader } from '../components/common';
import { AddTaskModal } from '../components/AddTaskModal';
import { ArrowLeft, User, MapPin, Clock, FileText, Upload, BrainCircuit, CheckCircle2, Circle, Plus, File } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCourse, documents, addDocument } = useCourses();
  const { tasks } = useTasks();
  
  const course = getCourse(id || '');
  const courseDocuments = documents.filter(d => d.courseId === id);
  const courseTasks = tasks.filter(t => t.courseId === id);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  if (!course) {
    return <div>Course not found</div>;
  }

  // Mock upload handler
  const handleFileUpload = () => {
    // In a real app, file selection logic would go here
    const title = prompt("資料のタイトルを入力してください");
    if (title) {
        addDocument({
            courseId: course.id,
            title: title,
            type: 'PDF',
            summary: 'アップロードされたばかりの資料です。AIインデックス処理待ち。'
        });
    }
  };

  return (
    <div className="space-y-6 min-w-0">
      <PageHeader
        description={
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <span className="text-lg font-semibold text-gray-900 dark:text-white truncate">{course.name}</span>
            <Badge color="gray">{course.credits} 単位</Badge>
          </div>
        }
        actions={
          <Link to="/courses">
            <Button variant="secondary" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Assignments */}
        <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <Card className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">担当教員</p>
                        <p className="font-medium text-gray-900 dark:text-white">{course.professor}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">開講日時</p>
                        <p className="font-medium text-gray-900 dark:text-white">{course.dayOfWeek}曜 {course.period}限</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">教室</p>
                        <p className="font-medium text-gray-900 dark:text-white">{course.room || '未定'}</p>
                    </div>
                </div>
            </Card>

            {/* Assignments (Tasks) */}
            <Card>
                <SectionHeader
                  title={
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <span>課題・タスク</span>
                    </div>
                  }
                  action={
                    <Button size="sm" variant="secondary" onClick={() => setIsTaskModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-1 flex-shrink-0" /> <span className="truncate">課題を追加</span>
                    </Button>
                  }
                />
                
                <div className="space-y-3">
                    {courseTasks.length > 0 ? (
                        courseTasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={task.status === '完了' ? 'text-green-500' : 'text-gray-300'}>
                                        {task.status === '完了' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${task.status === '完了' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-gray-500">期限: {task.dueDate}</p>
                                    </div>
                                </div>
                                <Badge color={task.priority === '高' ? 'red' : 'gray'}>{task.priority}</Badge>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            現在、登録されている課題はありません。
                        </div>
                    )}
                </div>
            </Card>
        </div>

        {/* Right Column: RAG / Documents */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-6 h-6 text-indigo-200 flex-shrink-0" />
                    <h3 className="text-lg font-bold">AI学習資料</h3>
                </div>
                <p className="text-sm text-indigo-100 mb-4">
                    シラバスやレジュメをアップロードすると、AIアシスタントが内容を学習し、質問に答えられるようになります。
                </p>
                <Button size="sm" className="w-full bg-white text-indigo-700 hover:bg-indigo-50 border-none" onClick={handleFileUpload}>
                    <Upload className="w-4 h-4 mr-2" /> 資料を追加
                </Button>
            </div>

            <Card>
                <SectionHeader title="アップロード済み資料" />
                <div className="space-y-3">
                    {courseDocuments.length > 0 ? (
                        courseDocuments.map(doc => (
                            <div key={doc.id} className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <File className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{doc.title}</span>
                                    </div>
                                    {doc.isIndexed ? (
                                        <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-1.5 py-0.5 rounded flex items-center">
                                            <BrainCircuit className="w-3 h-3 mr-1" /> 学習済
                                        </span>
                                    ) : (
                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 px-1.5 py-0.5 rounded">
                                            処理中
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {doc.summary || '要約を作成中...'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-400 text-xs">
                            資料はまだありません
                        </div>
                    )}
                </div>
            </Card>
        </div>
      </div>

      <AddTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        defaultCategory="学習"
        defaultCourseId={course.id}
      />
    </div>
  );
};

export default CourseDetail;
