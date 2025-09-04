import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/forms/LoginForm';
import { BookOpen } from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // After login, redirect based on user role from backend
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const user = await login(data.email, data.password, role);
      toast.success('Login successful!');
      // Redirect based on user.role from backend
      if (user.role === 'teacher') {
        navigate('/teacher-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your classroom account
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <LoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
            role={role}
            onRoleChange={setRole}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
