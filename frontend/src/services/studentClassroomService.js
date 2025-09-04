import api from './api';

export const studentClassroomService = {
  leaveClassroom: async (classroomId) => {
    // This endpoint should be implemented in backend as well
  const response = await api.delete(`/api/student/classroom/${classroomId}`);
    return response.data;
  },
};

export default studentClassroomService;
