import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, BookOpen } from 'lucide-react';

const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/subject/${subject._id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <FileText size={16} />
              <span>{subject.materials?.length || 0} materials</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{subject.assignments?.length || 0} assignments</span>
            </span>
          </div>
        </div>
        
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <BookOpen size={24} className="text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
