import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { studentService } from '../../services/studentService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  CheckSquare,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Settings,
  Menu
} from 'lucide-react';

/* ---------------- Profile Settings Dropdown ---------------- */
function ProfileSettingsDropdown({ logout, user }) {
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const ref = useRef(null);

  // Auto-detect whether to open upwards or downwards based on available space
  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpwards(spaceBelow < 180); // If less than 180px below → open upwards
    }
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {/* Settings Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 hover:bg-gray-100 rounded"
        title="Settings"
      >
        <Settings size={16} className="text-gray-500" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute right-0 w-48 bg-white rounded shadow-lg z-20 border border-gray-200 transition-all duration-200 ${
            openUpwards ? 'bottom-10' : 'mt-2'
          }`}
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-medium text-gray-900">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Sidebar Component ---------------- */
const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrolledExpanded, setEnrolledExpanded] = useState(true);

  // Fetch enrolled classrooms only for students
  const { data: enrolledClassrooms, isLoading: isEnrolledLoading } = useQuery(
    ['enrolledClassrooms'],
    () => user?.role === 'student' ? studentService.getClassrooms() : [],
    { staleTime: 5 * 60 * 1000, enabled: user?.role === 'student' }
  );

  // Get user initials
  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';


  // Only show student links if user is student
  let navItems = [];
  if (user?.role === 'student') {
    navItems = [
      { icon: Home, label: 'Home', path: '/dashboard' },
      { icon: CheckSquare, label: 'To-do', path: '/todo' }
    ];
  } else if (user?.role === 'teacher') {
    navItems = [
      { icon: Home, label: 'Home', path: '/teacher-dashboard' },
      // Add teacher links here if needed
    ];
  }

  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed lg:relative h-full z-50`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          {!collapsed && (
            <>
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="text-xl font-medium text-gray-800">Classroom</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => {
                  // If student, always redirect to /dashboard
                  if (user?.role === 'student' && item.path !== '/dashboard') {
                    navigate('/dashboard');
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700'
                }`}
                title={collapsed ? item.label : ''}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}

          {!collapsed && (
            <>
              {/* Enrolled Section */}
              <li className="pt-4">
                <button
                  onClick={() => setEnrolledExpanded(!enrolledExpanded)}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <span className="font-medium">Enrolled</span>
                  {enrolledExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </li>

              {/* Enrolled Classes */}
              {enrolledExpanded && (
                <li className="ml-4 space-y-1">
                  {isEnrolledLoading ? (
                    <div className="px-3 py-2 text-xs text-gray-400">
                      Loading...
                    </div>
                  ) : Array.isArray(enrolledClassrooms) &&
                    enrolledClassrooms.length > 0 ? (
                    enrolledClassrooms.map((classroom) => (
                      <button
                        key={classroom._id}
                        className="w-full flex items-center space-x-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg text-left"
                        onClick={() => navigate(`/classroom/${classroom._id}`)}
                      >
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                          {getInitials(classroom.name)}
                        </div>
                        <div>
                          <div className="font-medium">{classroom.name}</div>
                          <div className="text-xs text-gray-500">
                            {classroom.classCode}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-gray-400">
                      No enrolled classrooms
                    </div>
                  )}
                </li>
              )}
            </>
          )}
        </ul>
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 relative">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <ProfileSettingsDropdown logout={logout} user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
