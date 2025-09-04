import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Calendar, Plus, Edit, Trash2, Users, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import CreateAssignmentModal from '../../components/teacher/CreateAssignmentModal';
import api from '../../services/api';

const AssignmentManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const queryClient = useQueryClient();

  const { data: assignments, isLoading } = useQuery(
    'teacherAssignments',
    () => api.get('api/teacher/assignments').then(res => res.data)
  );

  const deleteAssignmentMutation = useMutation(
    (assignmentId) => api.delete(`api/teacher/assignment/${assignmentId}`),
    {
      onSuccess: () => {
        toast.success('Assignment deleted successfully!');
        queryClient.invalidateQueries('teacherAssignments');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to delete assignment');
      }
    }
  );

  const handleDelete = (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      deleteAssignmentMutation.mutate(assignmentId);
    }
  };

  const getStatusInfo = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = now > dueDate;
    const submissionCount = assignment.submissions?.length || 0;
    
    if (isOverdue) {
      return {
        status: 'Overdue',
        color: 'text-red-600 bg-red-50',
        icon: Clock
      };
    } else {
      return {
        status: 'Active',
        color: 'text-green-600 bg-green-50',
        icon: CheckCircle
      };
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
          title="Assignment Management" 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Assignments</h1>
                <p className="text-gray-600">Manage all your assignments across subjects</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Create Assignment</span>
              </button>
            </div>

            {/* Assignments List */}
            {assignments?.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const statusInfo = getStatusInfo(assignment);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={assignment._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon size={12} className="mr-1" />
                              {statusInfo.status}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Subject</p>
                              <p className="font-medium text-gray-900">{assignment.subjectName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Due Date</p>
                              <p className="font-medium text-gray-900">
                                {new Date(assignment.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Points</p>
                              <p className="font-medium text-gray-900">{assignment.totalPoints}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Submissions</p>
                              <p className="font-medium text-gray-900 flex items-center">
                                <Users size={14} className="mr-1" />
                                {assignment.submissions?.length || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                            View Submissions
                          </button>
                          <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(assignment._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={deleteAssignmentMutation.isLoading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Submission Progress</span>
                          <span className="text-sm text-gray-900">
                            {assignment.submissions?.length || 0} / {assignment.totalStudents || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${assignment.totalStudents > 0 
                                ? ((assignment.submissions?.length || 0) / assignment.totalStudents) * 100 
                                : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                  <p className="text-gray-500 mb-6">
                    Create your first assignment to start evaluating student work.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create your first assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateAssignmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        subjectId={selectedSubject}
      />
    </div>
  );
};

export default AssignmentManagement;
