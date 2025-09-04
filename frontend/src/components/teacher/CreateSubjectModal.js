import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import Modal from '../common/Modal';
import api from '../../services/api';

const CreateSubjectModal = ({ isOpen, onClose, classroomId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const queryClient = useQueryClient();

  const createSubjectMutation = useMutation(
    (data) => api.post('/api/teacher/subject', { ...data, classroomId }),
    {
      onSuccess: () => {
        toast.success('Subject created successfully!');
        queryClient.invalidateQueries(['classroom', classroomId]);
        onClose();
        setFormData({ name: '', description: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to create subject');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    createSubjectMutation.mutate(formData);
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: '', description: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create subject">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject name (required)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter subject name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter subject description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
              disabled={createSubjectMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || createSubjectMutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createSubjectMutation.isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateSubjectModal;
