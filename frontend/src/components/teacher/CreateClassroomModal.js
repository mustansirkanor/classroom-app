import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import Modal from '../common/Modal';
import api from '../../services/api';

const CreateClassroomModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const queryClient = useQueryClient();

  const createClassroomMutation = useMutation(
    (data) => api.post('/teacher/classroom', data),
    {
      onSuccess: () => {
        toast.success('Classroom created successfully!');
        queryClient.invalidateQueries('teacherDashboard');
        onClose();
        setFormData({ name: '', description: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to create classroom');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    createClassroomMutation.mutate(formData);
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: '', description: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create classroom">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class name (required)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter class name"
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
              placeholder="Enter class description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
              disabled={createClassroomMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || createClassroomMutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createClassroomMutation.isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateClassroomModal;
