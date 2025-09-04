import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, Users, Calendar, FileText, MoreVertical, MessageSquare } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import SubjectCard from '../../components/student/SubjectCard';
import api from '../../services/api';

import materialService from '../../services/materialService';
import MaterialCard from '../../components/student/MaterialCard';


const ClassroomDetails = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subjects');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch study materials for the classroom (for stream tab)
  const { data: materials, isLoading: isMaterialsLoading } = useQuery(
    ['materials', classroomId],
    () => materialService.getMaterialsByClassroom(classroomId),
    { enabled: !!classroomId }
  );

  const { data: classroom, isLoading } = useQuery(
    ['classroom', classroomId],
    () => api.get(`api/student/classroom/${classroomId}`).then(res => res.data)
  );

  const { data: subjects } = useQuery(
    ['subjects', classroomId],
    () => api.get(`api/student/subjects/${classroomId}`).then(res => res.data),
    { enabled: !!classroomId }
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
          title={classroom?.name || 'Classroom'} 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          showSearch={false}
        />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>

            {/* Tab Navigation */}
            <div className="flex space-x-8 border-b border-gray-200 mb-8">
              <button
                className={`py-3 px-4 font-medium text-lg transition-colors ${activeTab === 'subjects' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('subjects')}
              >
                Subjects
              </button>
              <button
                className={`py-3 px-4 font-medium text-lg transition-colors ${activeTab === 'people' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('people')}
              >
                People
              </button>
            </div>



            {activeTab === 'subjects' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><FileText className="mr-2" />Subjects</h2>
                <div className="space-y-4">
                  {Array.isArray(subjects) && subjects.length > 0 ? (
                    subjects.map((subject, idx) => (
                      <SubjectCard key={subject?._id || idx} subject={{
                        _id: subject?._id || idx,
                        name: subject?.name || 'Untitled Subject',
                        description: subject?.description || '',
                        materials: subject?.materials || [],
                        assignments: subject?.assignments || [],
                      }} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">No subjects available yet.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'people' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center"><Users className="mr-2" />People</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher</h3>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {classroom?.teacherId?.name?.charAt(0)}
                    </div>
                    <span className="text-gray-900">{classroom?.teacherId?.name}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Students ({classroom?.students?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {classroom?.students?.map((student, index) => (
                      <div key={student._id || index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {student.name?.charAt(0)}
                        </div>
                        <span className="text-gray-900">{student.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetails;
