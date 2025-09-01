import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Download, CheckCircle, Play, FileText, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import api from '../../services/api';

const MaterialViewer = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const queryClient = useQueryClient();

  const { data: material, isLoading } = useQuery(
    ['material', materialId],
    () => api.get(`/student/material/${materialId}`).then(res => res.data)
  );

  const markCompleteMutation = useMutation(
    () => api.patch(`/student/progress/${materialId}`, { completed: true, progress: 100 }),
    {
      onSuccess: () => {
        toast.success('Material marked as complete!');
        queryClient.invalidateQueries(['material', materialId]);
      }
    }
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play size={24} className="text-red-600" />;
      case 'podcast':
        return <Play size={24} className="text-green-600" />;
      case 'ppt':
        return <FileText size={24} className="text-orange-600" />;
      default:
        return <FileText size={24} className="text-blue-600" />;
    }
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
          title="Material Viewer" 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Subject</span>
            </button>

            {/* Material Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {getTypeIcon(material?.type)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{material?.title}</h1>
                    <p className="text-gray-600 mb-4">{material?.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{material?.type}</span>
                      <span>•</span>
                      <span>Added {new Date(material?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!material?.progress?.completed && (
                    <button
                      onClick={() => markCompleteMutation.mutate()}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={markCompleteMutation.isLoading}
                    >
                      <CheckCircle size={16} />
                      <span>Mark Complete</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.open(material?.fileUrl, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Material Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center py-12">
                {material?.type === 'video' || material?.type === 'podcast' ? (
                  <div>
                    <Play size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">Media player will be embedded here</p>
                    <button
                      onClick={() => window.open(material?.fileUrl, '_blank')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Open in New Tab
                    </button>
                  </div>
                ) : (
                  <div>
                    <Eye size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">Document viewer will be embedded here</p>
                    <button
                      onClick={() => window.open(material?.fileUrl, '_blank')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Document
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Section */}
            {material?.progress && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completion</span>
                  <span className="text-sm font-medium text-gray-900">
                    {material.progress.progress || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${material.progress.progress || 0}%` }}
                  />
                </div>
                {material.progress.completed && (
                  <p className="text-sm text-green-600 flex items-center space-x-1">
                    <CheckCircle size={16} />
                    <span>Completed on {new Date(material.progress.completedAt).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialViewer;
