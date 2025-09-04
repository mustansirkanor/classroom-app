import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Users, Plus, Settings, Copy, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import CreateSubjectModal from '../../components/teacher/CreateSubjectModal';
import StudentList from '../../components/teacher/StudentList';
import api from '../../services/api';

const ClassroomManagement = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const { data: classroom, isLoading } = useQuery(
    ['teacherClassroom', classroomId],
    () => api.get(`/api/teacher/classroom/${classroomId}`).then(res => res.data)
  );

  // Fetch announcements
  React.useEffect(() => {
    if (!classroomId) return;
  api.get(`/api/teacher/announcements/${classroomId}`)
      .then(res => setAnnouncements(res.data))
      .catch(() => setAnnouncements([]));
  }, [classroomId, activeTab]);

  // Post new announcement
  const handlePostAnnouncement = async () => {
    if (!announcementText.trim()) return;
    setIsPosting(true);
    try {
  const res = await api.post(`/api/teacher/announcements/${classroomId}`, { text: announcementText });
      setAnnouncements([res.data, ...announcements]);
      setAnnouncementText('');
      toast.success('Announcement posted!');
    } catch (err) {
      toast.error('Failed to post announcement');
    }
    setIsPosting(false);
  };

  const { data: subjects } = useQuery(
    ['teacherSubjects', classroomId],
  () => api.get(`/api/teacher/subjects/${classroomId}`).then(res => res.data),
    { enabled: !!classroomId }
  );

  const copyClassCode = () => {
    navigator.clipboard.writeText(classroom?.classCode);
    toast.success('Class code copied to clipboard!');
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
          title={classroom?.name || 'Classroom Management'} 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 overflow-y-auto">
          {/* Classroom Header */}
          <div className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{classroom?.name}</h1>
                  <p className="text-blue-100 mb-4">{classroom?.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <span className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{classroom?.students?.length || 0} students</span>
                    </span>
                    <button 
                      onClick={copyClassCode}
                      className="flex items-center space-x-1 hover:text-white transition-colors"
                    >
                      <Copy size={16} />
                      <span>Code: {classroom?.classCode}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCreateSubject(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Subject</span>
                  </button>
                  <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <nav className="flex space-x-8">
                {[ 
                  { key: 'subjects', label: 'Subjects' },
                  { key: 'students', label: 'Students' },
                  { key: 'announcements', label: 'Announcements' },
                  { key: 'settings', label: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            {activeTab === 'subjects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Subjects</h2>
                  <button
                    onClick={() => setShowCreateSubject(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Subject</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample Subject Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition" onClick={() => navigate(`/teacher/subject/sample-id`)}>
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <BookOpen size={20} className="text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Sample Subject</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">This is a sample subject card. Click to manage subject details.</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>3 materials</span>
                      <span>2 assignments</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" onClick={() => navigate(`/teacher/subject/sample-id`)}>
                        Manage Subject
                      </button>
                    </div>
                  </div>
                  {/* Actual subjects */}
                  {subjects?.length > 0 && subjects.map((subject) => (
                    <div key={subject._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition" onClick={() => navigate(`/teacher/subject/${subject._id}`)}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{subject.materials?.length || 0} materials</span>
                        <span>{subject.assignments?.length || 0} assignments</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" onClick={() => navigate(`/teacher/subject/${subject._id}`)}>
                          Manage Subject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <StudentList students={classroom?.students} />
            )}

            {activeTab === 'announcements' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h3>
                <div className="mb-6">
                  <textarea
                    value={announcementText}
                    onChange={e => setAnnouncementText(e.target.value)}
                    rows={2}
                    placeholder="Write an announcement..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handlePostAnnouncement}
                      disabled={isPosting || !announcementText.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isPosting ? 'Posting...' : 'Post Announcement'}
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map(a => (
                      <div key={a._id} className="border-b pb-4">
                        <div className="text-gray-900 font-medium">{a.content || a.text}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(a.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No announcements yet.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Classroom Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Classroom Name
                    </label>
                    <input
                      type="text"
                      defaultValue={classroom?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      defaultValue={classroom?.description}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="pt-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateSubjectModal
        isOpen={showCreateSubject}
        onClose={() => setShowCreateSubject(false)}
        classroomId={classroomId}
      />
    </div>
  );
};

export default ClassroomManagement;
