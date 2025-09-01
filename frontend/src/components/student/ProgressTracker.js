import React from 'react';
import { CheckCircle, Circle, Award } from 'lucide-react';

const ProgressTracker = ({ progress, totalMaterials }) => {
  const completedCount = progress?.filter(p => p.completed).length || 0;
  const progressPercentage = totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
        <Award size={20} className="text-yellow-500" />
      </div>

      <div className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overall Completion</span>
            <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-400">{totalMaterials - completedCount}</div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Recent Activity</h4>
          <div className="space-y-1">
            {progress?.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                {item.completed ? (
                  <CheckCircle size={12} className="text-green-500" />
                ) : (
                  <Circle size={12} className="text-gray-300" />
                )}
                <span className="text-gray-600 truncate">Material {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
