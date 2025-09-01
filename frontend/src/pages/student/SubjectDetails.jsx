import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, FileText, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import MaterialCard from '../../components/student/MaterialCard';
import AssignmentCard from '../../components/student/AssignmentCard';
import ProgressTracker from '../../components/student/ProgressTracker';
import api from '../../services/api';

const SubjectDetails = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('materials');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();

  const { data: subject, isLoading } = useQuery(
    ['subject', subjectId],
    () => api.get(`/student/subject/${subjectId}`).then(res => res.data)
  );

  const { data: materials } = useQuery(
    ['materials', subjectId],
    () => api.get(`/student/materials/${subjectId}`).then(res => res.data),
    { enabled: !!subjectId }
  );

  const { data: assignments } = useQuery(
    ['assignments', subjectId],
    () => api.get(`/student/assignments/${subjectId}`).then(res => res.data),
    { enabled: !!subjectId }
  );

  const markCompleteMutation = useMutation(
    (materialId) => api.patch(`/student/progress/${materialId}`, { completed: true, progress: 100 }),
    {
      onSuccess: () => {
        toast.success('Material marked as complete!');
        queryClient.invalidateQueries(['materials', subjectId]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to update progress');
      }
    }
  );

  const handleMarkComplete = (materialId) => {
    markCompleteMutation.mutate(materialId);
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
          title={subject?.name || 'Subject'} 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 overflow-y-auto">
          {/* Subject Header */}
          <div className="bg-green-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-green-100 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Classroom</span>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold mb-2">{subject?.name}</h1>
                <p className="text-green-100">{subject?.description}</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {activeTab === 'materials' && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Learning Materials ({materials?.length || 0})
                    </h2>
                    
                    {materials?.length > 0 ? (
                      materials.map((material) => (
                        <MaterialCard 
                          key={material._id} 
                          material={material}
                          progress={material.progress}
                          onMarkComplete={handleMarkComplete}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No materials available yet</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'assignments' && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Assignments ({assignments?.length || 0})
                    </h2>
                    
                    {assignments?.length > 0 ? (
                      assignments.map((assignment) => (
                        <AssignmentCard 
                          key={assignment._id} 
                          assignment={assignment}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No assignments available yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <ProgressTracker 
                  progress={materials?.map(m => m.progress).filter(Boolean) || []}
                  totalMaterials={materials?.length || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetails;
