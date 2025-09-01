import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Upload } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';

const UploadMaterialModal = ({ isOpen, onClose, subjectId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'document',
    fileUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadMaterialMutation = useMutation(
    (data) => api.post('/teacher/material', { ...data, subjectId }),
    {
      onSuccess: () => {
        toast.success('Material uploaded successfully!');
        queryClient.invalidateQueries(['subject', subjectId]);
        onClose();
        setFormData({ title: '', description: '', type: 'document', fileUrl: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to upload material');
      }
    }
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // In a real app, you would upload to your file storage service
      // For demo purposes, we'll use a placeholder URL
      const fileUrl = `https://example.com/files/${file.name}`;
      setFormData({ ...formData, fileUrl, title: formData.title || file.name });
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.fileUrl) return;
    uploadMaterialMutation.mutate(formData);
  };

  const handleClose = () => {
    onClose();
    setFormData({ title: '', description: '', type: 'document', fileUrl: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload material">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material title (required)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter material title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="document">Document</option>
              <option value="ppt">Presentation</option>
              <option value="video">Video</option>
              <option value="podcast">Podcast</option>
              <option value="summary">Summary</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">Upload a file</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, PPT, MP4, MP3 up to 50MB
                </p>
                {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                {formData.fileUrl && (
                  <p className="text-sm text-green-600 mt-2">File uploaded successfully</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter material description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
              disabled={uploadMaterialMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.fileUrl || uploadMaterialMutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadMaterialMutation.isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UploadMaterialModal;
