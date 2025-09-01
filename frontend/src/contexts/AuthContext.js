// import React, { createContext, useContext, useState, useEffect } from 'react';
// import api from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const response = await api.get('/auth/verify');
//         setUser(response.data.user);
//       } catch (error) {
//         localStorage.removeItem('token');
//         setUser(null);
//       }
//     }
//     setLoading(false);
//   };

//   const login = async (email, password, role) => {
//     const response = await api.post('/auth/login', { email, password, role });
//     const { token, user } = response.data;
    
//     localStorage.setItem('token', token);
//     setUser(user);
    
//     return user;
//   };

//   const register = async (name, email, password, role) => {
//     const response = await api.post('/auth/register', { name, email, password, role });
//     const { token, user } = response.data;
    
//     localStorage.setItem('token', token);
//     setUser(user);
    
//     return user;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading,
//     checkAuth
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Mock user data for development
  const [user, setUser] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'teacher' // Change to 'teacher' to see teacher dashboard
  });
  const [loading, setLoading] = useState(false); // Set to false to skip loading

  const login = async (email, password, role) => {
    // Mock login
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: email,
      role: role
    };
    setUser(mockUser);
    return mockUser;
  };

  const register = async (name, email, password, role) => {
    // Mock register
    const mockUser = {
      id: '1',
      name: name,
      email: email,
      role: role
    };
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  const checkAuth = () => {
    // Mock check auth - already have user set above
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
