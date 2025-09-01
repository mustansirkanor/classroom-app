import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ClassroomDetails from './pages/student/ClassroomDetails';
import SubjectDetails from './pages/student/SubjectDetails';
import MaterialViewer from './pages/student/MaterialViewer';
import AssignmentDetails from './pages/student/AssignmentDetails';
import ClassroomManagement from './pages/teacher/ClassroomManagement';
import SubjectManagement from './pages/teacher/SubjectManagement';
import MaterialManagement from './pages/teacher/MaterialManagement';
import AssignmentManagement from './pages/teacher/AssignmentManagement';
import ProfilePage from './pages/common/ProfilePage';
import NotFoundPage from './pages/common/NotFoundPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Student Routes - No authentication required for now */}
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/classroom/:classroomId" element={<ClassroomDetails />} />
                <Route path="/subject/:subjectId" element={<SubjectDetails />} />
                <Route path="/material/:materialId" element={<MaterialViewer />} />
                <Route path="/assignment/:assignmentId" element={<AssignmentDetails />} />
                
                {/* Teacher Routes - No authentication required for now */}
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/classroom/:classroomId" element={<ClassroomManagement />} />
                <Route path="/teacher/subject/:subjectId" element={<SubjectManagement />} />
                <Route path="/teacher/materials" element={<MaterialManagement />} />
                <Route path="/teacher/assignments" element={<AssignmentManagement />} />
                
                {/* Common Routes */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Redirect routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              
              {/* Global toast notifications */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#4ade80',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
