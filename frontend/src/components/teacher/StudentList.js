import React from 'react';
import { Users, Mail, MoreVertical } from 'lucide-react';

const StudentList = ({ students, className = '' }) => {
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Users size={20} />
          <span>Students ({students?.length || 0})</span>
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {students && students.length > 0 ? (
          students.map((student) => (
            <div key={student._id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(student.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      <Mail size={12} />
                      <span>{student.email}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Joined {new Date(student.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No students yet</h4>
            <p className="text-gray-500">
              Share your class code with students so they can join your classroom
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
