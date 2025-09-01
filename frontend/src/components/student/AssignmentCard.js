import React from 'react';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const AssignmentCard = ({ assignment, submission }) => {
  const formatDueDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: '1 day left', color: 'text-yellow-600' };
    return { text: `${diffDays} days left`, color: 'text-green-600' };
  };

  const getStatusIcon = () => {
    if (submission?.status === 'submitted') {
      return <CheckCircle size={16} className="text-green-600" />;
    }
    
    const daysLeft = getDaysLeft(assignment.dueDate);
    if (daysLeft.text === 'Overdue') {
      return <AlertCircle size={16} className="text-red-600" />;
    }
    
    return <Clock size={16} className="text-gray-400" />;
  };

  const daysLeft = getDaysLeft(assignment.dueDate);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText size={20} className="text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-1">{assignment.title}</h4>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{assignment.description}</p>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>Due {formatDueDate(assignment.dueDate)}</span>
              </span>
              <span>{assignment.totalPoints} points</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-1">
          {getStatusIcon()}
          <span className={`text-xs ${daysLeft.color}`}>
            {daysLeft.text}
          </span>
        </div>
      </div>

      {/* Submission Status */}
      {submission && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-600">
              {submission.status === 'submitted' ? 'Submitted' : 'Draft saved'}
            </span>
            {submission.grade && (
              <span className="font-medium">
                {submission.grade}/{assignment.totalPoints}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
