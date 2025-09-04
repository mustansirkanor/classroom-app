import api from './api';

export const authService = {
  // Register user
  register: async (userData) => {
  const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (loginData) => {
  const response = await api.post('/api/auth/login', loginData);
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
  const response = await api.get('/api/auth/verify');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
  const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
  const response = await api.put('/api/auth/password', passwordData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
  const response = await api.post('/api/auth/reset-password', { token, password });
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export default authService;
