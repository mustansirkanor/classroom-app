import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Settings,
  Menu
} from 'lucide-react';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [enrolledExpanded, setEnrolledExpanded] = useState(true);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: CheckSquare, label: 'To-do', path: '/todo' }
  ];

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed lg:relative h-full z-50`}>
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
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                  location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
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
                  {enrolledExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </li>

              {/* Sample Enrolled Classes */}
              {enrolledExpanded && (
                <li className="ml-4 space-y-1">
                  <div className="space-y-1">
                    <button className="w-full flex items-center space-x-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg text-left">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                        U
                      </div>
                      <div>
                        <div className="font-medium">UCS414</div>
                        <div className="text-xs text-gray-500">3C61</div>
                      </div>
                    </button>
                  </div>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button 
              onClick={logout}
              className="p-1 hover:bg-gray-100 rounded"
              title="Logout"
            >
              <Settings size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
