import api from './api';

export const teacherService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/teacher/dashboard');
    return response.data;
  },

  // Classrooms
  createClassroom: async (classroomData) => {
    const response = await api.post('/teacher/classroom', classroomData);
    return response.data;
  },

  getClassrooms: async () => {
    const response = await api.get('/teacher/classrooms');
    return response.data;
  },

  getClassroom: async (classroomId) => {
    const response = await api.get(`/teacher/classroom/${classroomId}`);
    return response.data;
  },

  updateClassroom: async (classroomId, classroomData) => {
    const response = await api.put(`/teacher/classroom/${classroomId}`, classroomData);
    return response.data;
  },

  deleteClassroom: async (classroomId) => {
    const response = await api.delete(`/teacher/classroom/${classroomId}`);
    return response.data;
  },

  // Subjects
  createSubject: async (subjectData) => {
    const response = await api.post('/teacher/subject', subjectData);
    return response.data;
  },

  getSubjects: async (classroomId) => {
    const response = await api.get(`/teacher/subjects/${classroomId}`);
    return response.data;
  },

  getSubject: async (subjectId) => {
    const response = await api.get(`/teacher/subject/${subjectId}`);
    return response.data;
  },

  updateSubject: async (subjectId, subjectData) => {
    const response = await api.put(`/teacher/subject/${subjectId}`, subjectData);
    return response.data;
  },

  deleteSubject: async (subjectId) => {
    const response = await api.delete(`/teacher/subject/${subjectId}`);
    return response.data;
  },

  // Materials
  uploadMaterial: async (materialData) => {
    const response = await api.post('/teacher/material', materialData);
    return response.data;
  },

  getMaterials: async (subjectId) => {
    const response = await api.get(`/teacher/materials/${subjectId || ''}`);
    return response.data;
  },

  getMaterial: async (materialId) => {
    const response = await api.get(`/teacher/material/${materialId}`);
    return response.data;
  },

  updateMaterial: async (materialId, materialData) => {
    const response = await api.put(`/teacher/material/${materialId}`, materialData);
    return response.data;
  },

  deleteMaterial: async (materialId) => {
    const response = await api.delete(`/teacher/material/${materialId}`);
    return response.data;
  },

  // Assignments
  createAssignment: async (assignmentData) => {
    const response = await api.post('/teacher/assignment', assignmentData);
    return response.data;
  },

  getAssignments: async (subjectId) => {
    const response = await api.get(`/teacher/assignments/${subjectId || ''}`);
    return response.data;
  },

  getAssignment: async (assignmentId) => {
    const response = await api.get(`/teacher/assignment/${assignmentId}`);
    return response.data;
  },

  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await api.put(`/teacher/assignment/${assignmentId}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/teacher/assignment/${assignmentId}`);
    return response.data;
  },

  // Submissions
  getSubmissions: async (assignmentId) => {
    const response = await api.get(`/teacher/submissions/${assignmentId}`);
    return response.data;
  },

  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.patch(`/teacher/grade/${submissionId}`, gradeData);
    return response.data;
  },

  // Students
  getStudents: async (classroomId) => {
    const response = await api.get(`/teacher/students/${classroomId}`);
    return response.data;
  },

  removeStudent: async (classroomId, studentId) => {
    const response = await api.delete(`/teacher/classroom/${classroomId}/student/${studentId}`);
    return response.data;
  }
};

export default teacherService;
