import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Calendar, FileText, Upload, Send, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import FileUpload from '../../components/forms/FileUpload';
import api from '../../services/api';

const AssignmentDetails = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const queryClient = useQueryClient();

  const { data: assignment, isLoading } = useQuery(
    ['assignment', assignmentId],
    () => api.get(`/student/assignment/${assignmentId}`).then(res => res.data)
  );

  const { data: submission } = useQuery(
    ['submission', assignmentId],
    () => api.get(`/student/submission/${assignmentId}`).then(res => res.data),
    { enabled: !!assignmentId }
  );

  const submitAssignmentMutation = useMutation(
    (data) => api.post(`/student/submit/${assignmentId}`, data),
    {
      onSuccess: () => {
        toast.success('Assignment submitted successfully!');
        queryClient.invalidateQueries(['submission', assignmentId]);
        setSubmissionText('');
        setAttachments([]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to submit assignment');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionText.trim() && attachments.length === 0) {
      toast.error('Please add content or attachments to submit');
      return;
    }

    submitAssignmentMutation.mutate({
      content: submissionText,
      attachments: attachments.map(file => ({
        name: file.name,
        url: `temp://${file.name}`, // In real app, upload files first
        size: file.size
      }))
    });
  };

  const formatDueDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: '1 day left', color: 'text-yellow-600' };
    return { text: `${diffDays} days left`, color: 'text-green-600' };
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

  const daysLeft = getDaysLeft(assignment?.dueDate);
  const isSubmitted = submission?.status === 'submitted';
  const isOverdue = daysLeft.text === 'Overdue';

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Assignment" 
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Assignment Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment?.title}</h1>
                      <p className="text-gray-600 mb-4">{assignment?.description}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{assignment?.instructions}</p>
                    </div>
                  </div>

                  {/* Attachments */}
                  {assignment?.attachments?.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
                      <div className="space-y-2">
                        {assignment.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <FileText size={16} className="text-blue-600" />
                            <span className="text-sm text-gray-900">{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submission Form */}
                {!isSubmitted && !isOverdue && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Work</h3>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add your response
                        </label>
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Type your answer here..."
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add files (optional)
                        </label>
                        <FileUpload
                          onFileSelect={setAttachments}
                          multiple={true}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitAssignmentMutation.isLoading}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send size={16} />
                        <span>{submitAssignmentMutation.isLoading ? 'Submitting...' : 'Submit'}</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Submitted Work */}
                {isSubmitted && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle size={20} className="text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Submitted</h3>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{submission?.content}</p>
                    
                    {submission?.attachments?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                        <div className="space-y-2">
                          {submission.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <FileText size={16} className="text-blue-600" />
                              <span className="text-sm text-gray-900">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {submission?.grade && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          Grade: {submission.grade}/{assignment?.totalPoints}
                        </p>
                        {submission.feedback && (
                          <p className="text-sm text-green-700 mt-2">{submission.feedback}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Due Date */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Due</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Calendar size={16} />
                    <span>{formatDueDate(assignment?.dueDate)}</span>
                  </div>
                  <p className={`text-sm font-medium ${daysLeft.color}`}>
                    {daysLeft.text}
                  </p>
                </div>

                {/* Points */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Points</h3>
                  <p className="text-2xl font-bold text-blue-600">{assignment?.totalPoints}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
