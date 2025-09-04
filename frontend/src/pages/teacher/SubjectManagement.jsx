import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FileText, Calendar, Plus, Upload } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import UploadMaterialModal from '../../components/teacher/UploadMaterialModal';
import CreateAssignmentModal from '../../components/teacher/CreateAssignmentModal';
import api from '../../services/api';

const SubjectManagement = () => {
  const { subjectId } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [activeTab, setActiveTab] = useState('materials');

  const { data: subject, isLoading } = useQuery(
    ['teacherSubject', subjectId],
    () => api.get(`api/teacher/subject/${subjectId}`).then(res => res.data)
  );

  const { data: materials } = useQuery(
    ['teacherMaterials', subjectId],
    () => api.get(`api/teacher/materials/${subjectId}`).then(res => res.data),
    { enabled: !!subjectId }
  );

  const { data: assignments } = useQuery(
    ['teacherAssignments', subjectId],
    () => api.get(`api/teacher/assignments/${subjectId}`).then(res => res.data),
    { enabled: !!subjectId }
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
          title={subject?.name || 'Subject Management'} 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 overflow-y-auto">
          {/* Subject Header */}
          <div className="bg-green-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{subject?.name}</h1>
                  <p className="text-green-100">{subject?.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowUploadMaterial(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                  >
                    <Upload size={16} />
                    <span>Upload Material</span>
                  </button>
                  <button
                    onClick={() => setShowCreateAssignment(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Create Assignment</span>
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
                  { key: 'materials', label: 'Materials', icon: FileText },
                  { key: 'assignments', label: 'Assignments', icon: Calendar }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      activeTab === tab.key
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            {activeTab === 'materials' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Materials ({materials?.length || 0})
                  </h2>
                  <button
                    onClick={() => setShowUploadMaterial(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload size={16} />
                    <span>Upload Material</span>
                  </button>
                </div>

                {materials?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((material) => (
                      <div key={material._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start space-x-3 mb-4">
                          <div className="p-2 bg-green-50 rounded-lg">
                            <FileText size={20} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{material.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                            <p className="text-xs text-gray-500 capitalize">{material.type}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-4">
                          Uploaded {new Date(material.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex justify-between items-center">
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">No materials uploaded yet</p>
                    <button
                      onClick={() => setShowUploadMaterial(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Upload your first material
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Assignments ({assignments?.length || 0})
                  </h2>
                  <button
                    onClick={() => setShowCreateAssignment(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Create Assignment</span>
                  </button>
                </div>

                {assignments?.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                            <p className="text-gray-600 mb-4">{assignment.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              <span>{assignment.totalPoints} points</span>
                              <span>{assignment.submissions?.length || 0} submissions</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                              View Submissions
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">No assignments created yet</p>
                    <button
                      onClick={() => setShowCreateAssignment(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create your first assignment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <UploadMaterialModal
        isOpen={showUploadMaterial}
        onClose={() => setShowUploadMaterial(false)}
        subjectId={subjectId}
      />

      <CreateAssignmentModal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
        subjectId={subjectId}
      />
    </div>
  );
};

export default SubjectManagement;
