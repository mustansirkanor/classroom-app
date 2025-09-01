import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Users, Plus, Settings, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import CreateSubjectModal from '../../components/teacher/CreateSubjectModal';
import StudentList from '../../components/teacher/StudentList';
import api from '../../services/api';

const ClassroomManagement = () => {
  const { classroomId } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: classroom, isLoading } = useQuery(
    ['teacherClassroom', classroomId],
    () => api.get(`/teacher/classroom/${classroomId}`).then(res => res.data)
  );

  const { data: subjects } = useQuery(
    ['teacherSubjects', classroomId],
    () => api.get(`/teacher/subjects/${classroomId}`).then(res => res.data),
    { enabled: !!classroomId }
  );

  const copyClassCode = () => {
    navigator.clipboard.writeText(classroom?.classCode);
    toast.success('Class code copied to clipboard!');
  };

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
          title={classroom?.name || 'Classroom Management'} 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 overflow-y-auto">
          {/* Classroom Header */}
          <div className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{classroom?.name}</h1>
                  <p className="text-blue-100 mb-4">{classroom?.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <span className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{classroom?.students?.length || 0} students</span>
                    </span>
                    <button 
                      onClick={copyClassCode}
                      className="flex items-center space-x-1 hover:text-white transition-colors"
                    >
                      <Copy size={16} />
                      <span>Code: {classroom?.classCode}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCreateSubject(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Subject</span>
                  </button>
                  <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <nav className="flex space-x-8">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'subjects', label: 'Subjects' },
                  { key: 'students', label: 'Students' },
                  { key: 'settings', label: 'Settings' }
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
          <div className="max-w-7xl mx-auto px-4 py-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="text-center py-8 text-gray-500">
                      <p>No recent activity</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold text-blue-600">{classroom?.students?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Subjects</p>
                        <p className="text-2xl font-bold text-green-600">{subjects?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="text-sm text-gray-900">
                          {new Date(classroom?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subjects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Subjects</h2>
                  <button
                    onClick={() => setShowCreateSubject(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Subject</span>
                  </button>
                </div>

                {subjects?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                      <div key={subject._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{subject.materials?.length || 0} materials</span>
                          <span>{subject.assignments?.length || 0} assignments</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Manage Subject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No subjects created yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <StudentList students={classroom?.students} />
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Classroom Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Classroom Name
                    </label>
                    <input
                      type="text"
                      defaultValue={classroom?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      defaultValue={classroom?.description}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="pt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateSubjectModal
        isOpen={showCreateSubject}
        onClose={() => setShowCreateSubject(false)}
        classroomId={classroomId}
      />
    </div>
  );
};

export default ClassroomManagement;
