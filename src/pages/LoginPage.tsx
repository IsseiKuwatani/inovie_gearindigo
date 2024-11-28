import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import DemoLogin from '../components/auth/DemoLogin';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    const success = await login(data);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
        </div>

        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        <DemoLogin />
      </div>
    </div>
  );
}