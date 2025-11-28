
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Course, CourseDocument } from '../types';
import { mockCourses, mockCourseDocuments } from '../services/mockData';

interface CourseContextType {
  courses: Course[];
  documents: CourseDocument[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  addDocument: (doc: Omit<CourseDocument, 'id' | 'uploadDate' | 'isIndexed'>) => void;
  getCourse: (id: string) => Course | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [documents, setDocuments] = useState<CourseDocument[]>(mockCourseDocuments);

  const addCourse = (newCourse: Omit<Course, 'id'>) => {
    const course: Course = {
      ...newCourse,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCourses(prev => [...prev, course]);
  };

  const addDocument = (newDoc: Omit<CourseDocument, 'id' | 'uploadDate' | 'isIndexed'>) => {
    const doc: CourseDocument = {
      ...newDoc,
      id: Math.random().toString(36).substr(2, 9),
      uploadDate: new Date().toISOString().split('T')[0],
      isIndexed: false, // デフォルトは未インデックス（非同期処理想定）
    };
    setDocuments(prev => [...prev, doc]);
  };

  const getCourse = (id: string) => courses.find(c => c.id === id);

  return (
    <CourseContext.Provider value={{ courses, documents, addCourse, addDocument, getCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
