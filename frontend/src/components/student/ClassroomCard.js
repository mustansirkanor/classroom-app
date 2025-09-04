
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, MoreVertical, Calendar } from 'lucide-react';
import studentClassroomService from '../../services/studentClassroomService';


const ClassroomCard = ({ classroom, index, onDelete }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    if (window.confirm('Are you sure you want to leave/delete this classroom?')) {
      try {
        await studentClassroomService.leaveClassroom(classroom._id);
        if (onDelete) onDelete(classroom._id);
      } catch (err) {
        alert('Failed to delete classroom.');
      }
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

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

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'T';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/classroom/${classroom._id}`)}
    >
      {/* Card Header */}
      <div className={`${getClassroomColor(index)} px-4 py-6 relative`}>
        <div className="flex justify-between items-start">
          <div className="text-white">
            <h3 className="text-lg font-semibold mb-1 truncate">{classroom.name}</h3>
            <p className="text-sm opacity-90 mb-1">{classroom.classCode}</p>
            <p className="text-xs opacity-75">{classroom.teacherId?.name}</p>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
              onClick={e => {
                e.stopPropagation();
                setDropdownOpen((open) => !open);
              }}
            >
              <MoreVertical size={20} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-10 border border-gray-200">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleDelete}
                >
                  Exit
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Teacher Avatar */}
        <div className="absolute bottom-4 right-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(classroom.teacherId?.name)}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {classroom.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{classroom.description}</p>
        )}
        
        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Users size={12} />
            <span>{classroom.students?.length || 0} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText size={12} />
            <span>{classroom.subjects?.length || 0} subjects</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="text-xs text-gray-500">
          <div className="flex items-center space-x-1 mb-1">
            <Calendar size={12} />
            <span>No upcoming assignments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomCard;
