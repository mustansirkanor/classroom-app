import api from './api';

export const materialService = {
  getMaterialsByClassroom: async (classroomId) => {
    const response = await api.get(`/api/student/classroom/${classroomId}/materials`);
    return response.data;
  },
};

export default materialService;
