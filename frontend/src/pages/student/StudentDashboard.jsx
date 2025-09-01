import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Plus } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import ClassroomCard from '../../components/student/ClassroomCard';
import JoinClassModal from '../../components/student/JoinClassModal';
import api from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const { data: dashboardData, isLoading } = useQuery(
    'studentDashboard',
    () => api.get('/student/dashboard').then(res => res.data)
  );

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Home" 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Ready to continue learning? Check out your classrooms below.
              </p>
            </div>

            {/* Add Join Class Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowJoinModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Join Class</span>
              </button>
            </div>

            {/* Classrooms Grid */}
            {dashboardData?.classrooms?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dashboardData.classrooms.map((classroom, index) => (
                  <ClassroomCard 
                    key={classroom._id} 
                    classroom={classroom} 
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classrooms yet</h3>
                  <p className="text-gray-500 mb-6">
                    Get started by joining a classroom with a class code from your teacher.
                  </p>
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join your first class
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <JoinClassModal 
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  );
};

export default StudentDashboard;
