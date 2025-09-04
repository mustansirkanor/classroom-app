import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import Modal from '../common/Modal';
import api from '../../services/api';

const CreateAssignmentModal = ({ isOpen, onClose, subjectId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    totalPoints: 100
  });
  const queryClient = useQueryClient();

  const createAssignmentMutation = useMutation(
    (data) => api.post('api/teacher/assignment', { ...data, subjectId }),
    {
      onSuccess: () => {
        toast.success('Assignment created successfully!');
        queryClient.invalidateQueries(['subject', subjectId]);
        onClose();
        setFormData({
          title: '',
          description: '',
          instructions: '',
          dueDate: '',
          totalPoints: 100
        });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to create assignment');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;
    createAssignmentMutation.mutate(formData);
  };

  const handleClose = () => {
    onClose();
    setFormData({
      title: '',
      description: '',
      instructions: '',
      dueDate: '',
      totalPoints: 100
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().slice(0, 16);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create assignment" size="lg">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment title (required)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter assignment title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter assignment description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Enter detailed instructions for students"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due date (required)
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                min={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) || 0 })}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
              disabled={createAssignmentMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || !formData.dueDate || createAssignmentMutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createAssignmentMutation.isLoading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateAssignmentModal;
