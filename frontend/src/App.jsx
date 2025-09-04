import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

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

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  if (user.role === 'teacher') {
    return <Navigate to="/teacher-dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

// Routes component to handle role-based routing
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Student Routes - Only accessible by students */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/classroom/:classroomId" 
        element={
          <ProtectedRoute role="student">
            <ClassroomDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/subject/:subjectId" 
        element={
          <ProtectedRoute role="student">
            <SubjectDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/material/:materialId" 
        element={
          <ProtectedRoute role="student">
            <MaterialViewer />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assignment/:assignmentId" 
        element={
          <ProtectedRoute role="student">
            <AssignmentDetails />
          </ProtectedRoute>
        } 
      />

      {/* Teacher Routes - Only accessible by teachers */}
      <Route 
        path="/teacher-dashboard" 
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/classroom/:classroomId" 
        element={
          <ProtectedRoute role="teacher">
            <ClassroomManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/subject/:subjectId" 
        element={
          <ProtectedRoute role="teacher">
            <SubjectManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/materials" 
        element={
          <ProtectedRoute role="teacher">
            <MaterialManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/assignments" 
        element={
          <ProtectedRoute role="teacher">
            <AssignmentManagement />
          </ProtectedRoute>
        } 
      />
      
      {/* Common Routes - Accessible by both roles */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      
      {/* Root redirect - redirects based on user role */}
      <Route path="/" element={<RoleBasedRedirect />} />
      
      {/* 404 and catch-all routes */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
              
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
