import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, BookOpen, FileText, Calendar, Plus } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import CreateClassroomModal from '../../components/teacher/CreateClassroomModal';
import api from '../../services/api';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: dashboardData, isLoading } = useQuery(
    'teacherDashboard',
    () => api.get('/api/teacher/dashboard').then(res => res.data),
    {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Handle Create Classroom
  const handleCreateClassroom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Create Classroom button clicked!');
    setShowCreateModal(true);
  };

  // Handle Manage Classroom - THIS WAS MISSING!
  const handleManageClassroom = (classroomId, e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Managing classroom with ID:', classroomId);
    // Navigate to classroom management page
  navigate(`/teacher/classroom/${classroomId}`);
  };

  const getClassroomColor = (index) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-red-500 to-orange-500',
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'bg-gradient-to-r from-pink-500 to-pink-600'
    ];
    return colors[index % colors.length];
  };

  console.log('Component rendered, showCreateModal:', showCreateModal);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
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
          title="Teacher Dashboard" 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  Manage your classrooms and track student progress.
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleCreateClassroom}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Plus size={20} />
                <span>Create Classroom</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Classrooms</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats?.totalClassrooms || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats?.totalStudents || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Materials</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats?.totalMaterials || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats?.totalAssignments || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Classrooms */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Classrooms</h2>
              
              {dashboardData?.classrooms?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {dashboardData.classrooms.map((classroom, index) => (
                    <div key={classroom._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className={`${getClassroomColor(index)} px-4 py-6 relative`}>
                        <div className="text-white">
                          <h3 className="text-lg font-semibold mb-1">{classroom.name}</h3>
                          <p className="text-sm opacity-90 mb-1">Code: {classroom.classCode}</p>
                          <p className="text-xs opacity-75">{classroom.students?.length || 0} students</p>
                        </div>
                      </div>

                      <div className="p-4">
                        {classroom.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{classroom.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{classroom.subjects?.length || 0} subjects</span>
                          <span>Created {new Date(classroom.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* FIXED: Added onClick handler to Manage button */}
                      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                        <button 
                          onClick={(e) => handleManageClassroom(classroom._id, e)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                        >
                          Manage Classroom
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <BookOpen size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classrooms yet</h3>
                    <p className="text-gray-500 mb-6">
                      Create your first classroom to start teaching and managing students.
                    </p>
                    <button
                      onClick={handleCreateClassroom}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create your first classroom
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Debug: Show modal state */}
        {showCreateModal && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded z-50">
            Modal should be visible!
          </div>
        )}
        
        <CreateClassroomModal 
          isOpen={showCreateModal}
          onClose={() => {
            console.log('Closing modal');
            setShowCreateModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
