import api from './api';

export const studentService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  // Classrooms
  joinClassroom: async (classCode) => {
    const response = await api.post('/student/join-class', { classCode });
    return response.data;
  },

  getClassrooms: async () => {
    const response = await api.get('/student/classrooms');
    return response.data;
  },

  getClassroom: async (classroomId) => {
    const response = await api.get(`/student/classroom/${classroomId}`);
    return response.data;
  },

  // Subjects
  getSubjects: async (classroomId) => {
    const response = await api.get(`/student/subjects/${classroomId}`);
    return response.data;
  },

  getSubject: async (subjectId) => {
    const response = await api.get(`/student/subject/${subjectId}`);
    return response.data;
  },

  // Materials
  getMaterials: async (subjectId) => {
    const response = await api.get(`/student/materials/${subjectId}`);
    return response.data;
  },

  getMaterial: async (materialId) => {
    const response = await api.get(`/student/material/${materialId}`);
    return response.data;
  },

  // Progress
  updateProgress: async (materialId, progressData) => {
    const response = await api.patch(`/student/progress/${materialId}`, progressData);
    return response.data;
  },

  getProgress: async (subjectId) => {
    const response = await api.get(`/student/progress/${subjectId}`);
    return response.data;
  },

  // Assignments
  getAssignments: async (subjectId) => {
    const response = await api.get(`/student/assignments/${subjectId}`);
    return response.data;
  },

  getAssignment: async (assignmentId) => {
    const response = await api.get(`/student/assignment/${assignmentId}`);
    return response.data;
  },

  // Submissions
  submitAssignment: async (assignmentId, submissionData) => {
    const response = await api.post(`/student/submit/${assignmentId}`, submissionData);
    return response.data;
  },

  getSubmission: async (assignmentId) => {
    const response = await api.get(`/student/submission/${assignmentId}`);
    return response.data;
  },

  // Stream
  getStream: async (classroomId) => {
    const response = await api.get(`/student/stream/${classroomId}`);
    return response.data;
  },

  createPost: async (classroomId, postData) => {
    const response = await api.post(`/student/post/${classroomId}`, postData);
    return response.data;
  }
};

export default studentService;
