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


import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Change if your backend runs elsewhere

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true // if you use cookies/auth
});

// Add interceptor to send token in Authorization header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
