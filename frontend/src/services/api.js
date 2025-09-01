// import api from './api';

// export const authService = {
//   // Register user
//   register: async (userData) => {
//     const response = await api.post('/auth/register', userData);
//     return response.data;
//   },

//   // Login user
//   login: async (loginData) => {
//     const response = await api.post('/auth/login', loginData);
//     return response.data;
//   },

//   // Verify token
//   verifyToken: async () => {
//     const response = await api.get('/auth/verify');
//     return response.data;
//   },

//   // Update profile
//   updateProfile: async (profileData) => {
//     const response = await api.put('/auth/profile', profileData);
//     return response.data;
//   },

//   // Update password
//   updatePassword: async (passwordData) => {
//     const response = await api.put('/auth/password', passwordData);
//     return response.data;
//   },

//   // Forgot password
//   forgotPassword: async (email) => {
//     const response = await api.post('/auth/forgot-password', { email });
//     return response.data;
//   },

//   // Reset password
//   resetPassword: async (token, password) => {
//     const response = await api.post('/auth/reset-password', { token, password });
//     return response.data;
//   },

//   // Logout (client-side only)
//   logout: () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   }
// };

// export default authService;
// Mock API responses for development
const mockData = {
  studentDashboard: {
    classrooms: [
      {
        _id: '1',
        name: 'Computer Science 101',
        description: 'Introduction to Programming',
        classCode: 'CS101A',
        teacherId: { name: 'Prof. Smith', email: 'smith@example.com' },
        students: Array(25).fill().map((_, i) => ({ _id: i, name: `Student ${i+1}` })),
        subjects: ['Programming', 'Algorithms'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Mathematics',
        description: 'Advanced Calculus',
        classCode: 'MATH201',
        teacherId: { name: 'Prof. Johnson', email: 'johnson@example.com' },
        students: Array(30).fill().map((_, i) => ({ _id: i, name: `Student ${i+1}` })),
        subjects: ['Calculus', 'Linear Algebra'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: 'Physics',
        description: 'Quantum Mechanics',
        classCode: 'PHY301',
        teacherId: { name: 'Prof. Wilson', email: 'wilson@example.com' },
        students: Array(20).fill().map((_, i) => ({ _id: i, name: `Student ${i+1}` })),
        subjects: ['Quantum Physics', 'Thermodynamics'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '4',
        name: 'Chemistry',
        description: 'Organic Chemistry',
        classCode: 'CHEM201',
        teacherId: { name: 'Prof. Brown', email: 'brown@example.com' },
        students: Array(28).fill().map((_, i) => ({ _id: i, name: `Student ${i+1}` })),
        subjects: ['Organic Chemistry', 'Biochemistry'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '5',
        name: 'English Literature',
        description: 'Modern Literature',
        classCode: 'ENG301',
        teacherId: { name: 'Prof. Davis', email: 'davis@example.com' },
        students: Array(22).fill().map((_, i) => ({ _id: i, name: `Student ${i+1}` })),
        subjects: ['Poetry', 'Drama'],
        createdAt: new Date().toISOString()
      }
    ],
    stats: {
      totalClassrooms: 5,
      totalSubjects: 10,
      totalMaterials: 45,
      completedMaterials: 32,
      progressPercentage: 71
    }
  },
  teacherDashboard: {
    classrooms: [
      {
        _id: '1',
        name: 'Computer Science 101',
        description: 'Introduction to Programming',
        classCode: 'CS101A',
        students: Array(25).fill().map((_, i) => ({ 
          _id: i, 
          name: `Student ${i+1}`, 
          email: `student${i+1}@example.com` 
        })),
        subjects: ['Programming Basics', 'Data Structures'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Advanced Programming',
        description: 'Object-Oriented Programming',
        classCode: 'CS201B',
        students: Array(20).fill().map((_, i) => ({ 
          _id: i, 
          name: `Student ${i+1}`, 
          email: `student${i+1}@example.com` 
        })),
        subjects: ['OOP Concepts', 'Design Patterns'],
        createdAt: new Date().toISOString()
      }
    ],
    stats: {
      totalClassrooms: 2,
      totalStudents: 45,
      totalSubjects: 4,
      totalMaterials: 15,
      totalAssignments: 8
    }
  }
};

// Mock API client
const api = {
  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url === '/student/dashboard') {
          resolve({ data: mockData.studentDashboard });
        } else if (url === '/teacher/dashboard') {
          resolve({ data: mockData.teacherDashboard });
        } else {
          resolve({ data: {} });
        }
      }, 500); // Simulate network delay
    });
  },
  post: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Success', ...data } });
      }, 500);
    });
  },
  put: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Updated successfully', ...data } });
      }, 500);
    });
  },
  delete: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Deleted successfully' } });
      }, 500);
    });
  },
  patch: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Updated successfully', ...data } });
      }, 500);
    });
  }
};

export default api;
