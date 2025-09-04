import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Plus, Bell } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import ClassroomCard from '../../components/student/ClassroomCard';
import JoinClassModal from '../../components/student/JoinClassModal';
import { studentService } from '../../services/studentService';

// Notification Dropdown Component
const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get enrolled classrooms
  const { data: classrooms = [] } = useQuery(
    ['enrolledClassrooms'],
    studentService.getClassrooms,
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch all announcements for all enrolled classrooms
  const { data: announcements = [], error: announcementsError } = useQuery(
    ['studentAnnouncementsAll'],
    () => api.get('/api/student/announcements').then(res => res.data),
    {
      retry: 1,
      refetchInterval: 30000,
      initialData: []
    }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = announcements.filter ? announcements.filter(ann => !ann.read).length : 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors"
        title="Notifications"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
          </div>

          {/* Scrollable Content */}
          <div 
            className="max-h-80 overflow-y-auto" 
            style={{ 
              scrollbarWidth: 'thin', 
              scrollbarColor: '#cbd5e1 transparent' 
            }}
          >
            {(!announcements || announcements.length === 0) ? (
              <div className="p-6 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No announcements yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {announcements.map((announcement, index) => (
                  <div
                    key={announcement._id || index}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !announcement.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {announcement.title || 'No title'}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {announcement.classroomName || 'Unknown'} • {announcement.teacherName || 'Teacher'}
                    </p>
                    <p className="text-sm text-gray-700 mb-2" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {announcement.content || 'No content'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'No date'}</span>
                      <span className="capitalize">{announcement.type || 'announcement'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .max-h-80::-webkit-scrollbar {
          width: 6px;
        }
        .max-h-80::-webkit-scrollbar-track {
          background: transparent;
        }
        .max-h-80::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
        .max-h-80::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Use the same query as Sidebar for enrolled classrooms
  const { data: classrooms = [], isLoading, error: dashboardError } = useQuery(
    ['enrolledClassrooms'],
    studentService.getClassrooms,
    { staleTime: 5 * 60 * 1000 }
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

  if (dashboardError) {
    return (
      <div className="flex h-screen">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">Error loading dashboard. Please try again later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Custom Header with Notification Bell */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Home</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Notification Dropdown */}
              <NotificationDropdown />
              
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Plus size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

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
            {classrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classrooms.map((classroom, index) => (
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
