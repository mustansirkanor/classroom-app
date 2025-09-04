
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Calendar, BookOpen, MoreVertical } from 'lucide-react';

const SubjectCard = ({ subject, index = 0 }) => {
  const navigate = useNavigate();

  const getSubjectColor = (index) => {
    const colors = [
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'bg-gradient-to-r from-pink-500 to-pink-600',
      'bg-gradient-to-r from-yellow-500 to-yellow-600'
    ];
    return colors[index % colors.length];
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/subject/${subject._id}`)}
    >
      {/* Card Header */}
      <div className={`${getSubjectColor(index)} px-4 py-6 relative`}>
        <div className="flex justify-between items-start">
          <div className="text-white">
            <h3 className="text-lg font-semibold mb-1 truncate">{subject.name}</h3>
            <p className="text-sm opacity-90 mb-1">{subject.code || ''}</p>
            <p className="text-xs opacity-75">{subject.teacherName || ''}</p>
          </div>
          <button 
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
            onClick={e => e.stopPropagation()}
          >
            <MoreVertical size={20} />
          </button>
        </div>
        {/* Subject Avatar */}
        <div className="absolute bottom-4 right-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(subject.name)}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {subject.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{subject.description}</p>
        )}
        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <FileText size={12} />
            <span>{subject.materials?.length || 0} materials</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{subject.assignments?.length || 0} assignments</span>
          </div>
        </div>
        {/* Recent Activity (optional, can be customized) */}
        <div className="text-xs text-gray-500">
          <div className="flex items-center space-x-1 mb-1">
            <Users size={12} />
            <span>No recent activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
