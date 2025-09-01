import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FileText, Upload, Edit, Trash2, Eye, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import UploadMaterialModal from '../../components/teacher/UploadMaterialModal';
import api from '../../services/api';

const MaterialManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const queryClient = useQueryClient();

  const { data: materials, isLoading } = useQuery(
    'teacherMaterials',
    () => api.get('/teacher/materials').then(res => res.data)
  );

  const deleteMaterialMutation = useMutation(
    (materialId) => api.delete(`/teacher/material/${materialId}`),
    {
      onSuccess: () => {
        toast.success('Material deleted successfully!');
        queryClient.invalidateQueries('teacherMaterials');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to delete material');
      }
    }
  );

  const handleDelete = (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterialMutation.mutate(materialId);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'document': FileText,
      'video': FileText,
      'podcast': FileText,
      'ppt': FileText,
      'summary': FileText
    };
    const Icon = icons[type] || FileText;
    return <Icon size={20} />;
  };

  const getTypeColor = (type) => {
    const colors = {
      'document': 'text-blue-600 bg-blue-50',
      'video': 'text-red-600 bg-red-50',
      'podcast': 'text-green-600 bg-green-50',
      'ppt': 'text-orange-600 bg-orange-50',
      'summary': 'text-purple-600 bg-purple-50'
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
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
          title="Material Management" 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Materials</h1>
                <p className="text-gray-600">Manage all your uploaded materials across subjects</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload size={20} />
                <span>Upload Material</span>
              </button>
            </div>

            {/* Materials Grid */}
            {materials?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <div key={material._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(material.type)}`}>
                          {getTypeIcon(material.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">{material.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{material.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="capitalize">{material.type}</span>
                            <span>•</span>
                            <span>{material.subjectName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        Uploaded {new Date(material.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(material.fileUrl, '_blank')}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => window.open(material.fileUrl, '_blank')}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleDelete(material._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                          disabled={deleteMaterialMutation.isLoading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Views: {material.views || 0}</span>
                        <span>Downloads: {material.downloads || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No materials yet</h3>
                  <p className="text-gray-500 mb-6">
                    Upload your first learning material to get started.
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload your first material
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <UploadMaterialModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        subjectId={selectedSubject}
      />
    </div>
  );
};

export default MaterialManagement;
