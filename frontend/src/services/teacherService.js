import api from './api';

export const teacherService = {
  // Dashboard
  getDashboard: async () => {
  const response = await api.get('/api/teacher/dashboard');
    return response.data;
  },

  // Classrooms
  createClassroom: async (classroomData) => {
  const response = await api.post('/api/teacher/classroom', classroomData);
    return response.data;
  },

  getClassrooms: async () => {
  const response = await api.get('/api/teacher/classrooms');
    return response.data;
  },

  getClassroom: async (classroomId) => {
  const response = await api.get(`/api/teacher/classroom/${classroomId}`);
    return response.data;
  },

  updateClassroom: async (classroomId, classroomData) => {
  const response = await api.put(`/api/teacher/classroom/${classroomId}`, classroomData);
    return response.data;
  },

  deleteClassroom: async (classroomId) => {
  const response = await api.delete(`/api/teacher/classroom/${classroomId}`);
    return response.data;
  },

  // Subjects
  createSubject: async (subjectData) => {
  const response = await api.post('/api/teacher/subject', subjectData);
    return response.data;
  },

  getSubjects: async (classroomId) => {
  const response = await api.get(`/api/teacher/subjects/${classroomId}`);
    return response.data;
  },

  getSubject: async (subjectId) => {
  const response = await api.get(`/api/teacher/subject/${subjectId}`);
    return response.data;
  },

  updateSubject: async (subjectId, subjectData) => {
  const response = await api.put(`/api/teacher/subject/${subjectId}`, subjectData);
    return response.data;
  },

  deleteSubject: async (subjectId) => {
  const response = await api.delete(`/api/teacher/subject/${subjectId}`);
    return response.data;
  },

  // Materials
  uploadMaterial: async (materialData) => {
  const response = await api.post('/api/teacher/material', materialData);
    return response.data;
  },

  getMaterials: async (subjectId) => {
  const response = await api.get(`/api/teacher/materials/${subjectId || ''}`);
    return response.data;
  },

  getMaterial: async (materialId) => {
  const response = await api.get(`/api/teacher/material/${materialId}`);
    return response.data;
  },

  updateMaterial: async (materialId, materialData) => {
  const response = await api.put(`/api/teacher/material/${materialId}`, materialData);
    return response.data;
  },

  deleteMaterial: async (materialId) => {
  const response = await api.delete(`/api/teacher/material/${materialId}`);
    return response.data;
  },

  // Assignments
  createAssignment: async (assignmentData) => {
  const response = await api.post('/api/teacher/assignment', assignmentData);
    return response.data;
  },

  getAssignments: async (subjectId) => {
  const response = await api.get(`/api/teacher/assignments/${subjectId || ''}`);
    return response.data;
  },

  getAssignment: async (assignmentId) => {
  const response = await api.get(`/api/teacher/assignment/${assignmentId}`);
    return response.data;
  },

  updateAssignment: async (assignmentId, assignmentData) => {
  const response = await api.put(`/api/teacher/assignment/${assignmentId}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
  const response = await api.delete(`/api/teacher/assignment/${assignmentId}`);
    return response.data;
  },

  // Submissions
  getSubmissions: async (assignmentId) => {
  const response = await api.get(`/api/teacher/submissions/${assignmentId}`);
    return response.data;
  },

  gradeSubmission: async (submissionId, gradeData) => {
  const response = await api.patch(`/api/teacher/grade/${submissionId}`, gradeData);
    return response.data;
  },

  // Students
  getStudents: async (classroomId) => {
  const response = await api.get(`/api/teacher/students/${classroomId}`);
    return response.data;
  },

  removeStudent: async (classroomId, studentId) => {
  const response = await api.delete(`/api/teacher/classroom/${classroomId}/student/${studentId}`);
    return response.data;
  }
};

export default teacherService;
