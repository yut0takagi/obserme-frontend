
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CalendarPage from './pages/Calendar';
import Diary from './pages/Diary';
import ImageEditor from './pages/ImageEditor';
import LiveAssistant from './pages/LiveAssistant';
import Profile from './pages/Profile';
import Integrations from './pages/Integrations';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { DiaryProvider } from './context/DiaryContext';
import { CourseProvider } from './context/CourseContext';

const App = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <DiaryProvider>
          <CourseProvider>
            <Router>
              <Routes>
                {/* Public Routes (No Sidebar) */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes (With Sidebar Layout) */}
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  
                  {/* Application Routes */}
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/applications/:id" element={<ApplicationDetail />} />

                  {/* Course Routes */}
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />

                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/diary" element={<Diary />} />
                  {/* Chat page removed, now a global sidebar */}
                  <Route path="/image-editor" element={<ImageEditor />} />
                  <Route path="/live-assistant" element={<LiveAssistant />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings/integrations" element={<Integrations />} />
                  
                  {/* Redirect legacy routes */}
                  <Route path="/settings" element={<Navigate to="/settings/integrations" replace />} />
                  <Route path="/chat" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/applications/wbs" element={<Navigate to="/applications" replace />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </CourseProvider>
        </DiaryProvider>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;
