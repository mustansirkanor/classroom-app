import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, Users, Calendar, FileText, MoreVertical, MessageSquare } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import SubjectCard from '../../components/student/SubjectCard';
import api from '../../services/api';

const ClassroomDetails = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stream');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: classroom, isLoading } = useQuery(
    ['classroom', classroomId],
    () => api.get(`/student/classroom/${classroomId}`).then(res => res.data)
  );

  const { data: subjects } = useQuery(
    ['subjects', classroomId],
    () => api.get(`/student/subjects/${classroomId}`).then(res => res.data),
    { enabled: !!classroomId }
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={classroom?.name || 'Classroom'} 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          showSearch={false}
        />

        <div className="flex-1 overflow-y-auto">
          {/* Classroom Header */}
          <div className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-blue-100 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </button>
              
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{classroom?.name}</h1>
                  <p className="text-blue-100 mb-4">{classroom?.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <span className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{classroom?.students?.length} students</span>
                    </span>
                    <span>Class code: {classroom?.classCode}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <nav className="flex space-x-8">
                {[
                  { key: 'stream', label: 'Stream' },
                  { key: 'classwork', label: 'Classwork' },
                  { key: 'people', label: 'People' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 py-6">
            {activeTab === 'stream' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-3">
                    <MessageSquare size={20} className="text-gray-400 mt-1" />
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Share something with your class..."
                        className="w-full border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center py-12 text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>This is where you'll see announcements from your teacher</p>
                </div>
              </div>
            )}

            {activeTab === 'classwork' && (
              <div className="space-y-6">
                {subjects?.map((subject) => (
                  <SubjectCard key={subject._id} subject={subject} />
                ))}

                {(!subjects || subjects.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No subjects available yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'people' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher</h3>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {classroom?.teacherId?.name?.charAt(0)}
                    </div>
                    <span className="text-gray-900">{classroom?.teacherId?.name}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Students ({classroom?.students?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {classroom?.students?.map((student, index) => (
                      <div key={student._id || index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {student.name?.charAt(0)}
                        </div>
                        <span className="text-gray-900">{student.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetails;
