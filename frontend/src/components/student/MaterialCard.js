import React from 'react';
import { FileText, Download, Play, Eye, CheckCircle } from 'lucide-react';

const MaterialCard = ({ material, progress, onMarkComplete }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'podcast':
        return <Play size={20} className="text-green-600" />;
      case 'video':
        return <Play size={20} className="text-red-600" />;
      case 'ppt':
        return <FileText size={20} className="text-orange-600" />;
      default:
        return <FileText size={20} className="text-blue-600" />;
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    window.open(material.fileUrl, '_blank');
  };

  const handleMarkComplete = (e) => {
    e.stopPropagation();
    onMarkComplete(material._id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-gray-50 rounded-lg">
            {getTypeIcon(material.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-1">{material.title}</h4>
            <p className="text-xs text-gray-500 mb-2">{material.description}</p>
            <p className="text-xs text-gray-400 capitalize">{material.type}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {progress?.completed ? (
            <CheckCircle size={16} className="text-green-600" />
          ) : (
            <button
              onClick={handleMarkComplete}
              className="p-1 hover:bg-gray-100 rounded"
              title="Mark as complete"
            >
              <CheckCircle size={16} className="text-gray-400" />
            </button>
          )}
          
          <button
            onClick={handleDownload}
            className="p-1 hover:bg-gray-100 rounded"
            title="Download"
          >
            <Download size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {progress && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress || 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialCard;
