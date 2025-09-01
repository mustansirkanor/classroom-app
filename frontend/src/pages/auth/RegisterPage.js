import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import RegisterForm from '../../components/forms/RegisterForm';
import { BookOpen } from 'lucide-react';

const RegisterPage = () => {
  const [role, setRole] = useState('student');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data) => {
    setIsLoading(true);
    try {
      const user = await register(data.name, data.email, data.password, role);
      toast.success('Account created successfully!');
      
      if (user.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
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
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our classroom community
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <RegisterForm 
            onSubmit={handleRegister}
            isLoading={isLoading}
            role={role}
            onRoleChange={setRole}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
