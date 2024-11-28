import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DEMO_ACCOUNTS = [
  { email: 'demo@example.com', password: 'demo123', label: 'デモアカウントでログイン' },
];

export default function DemoLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDemoLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const success = await login({ email, password });
      if (success) {
        navigate('/dashboard');
      } else {
        setError('デモアカウントでのログインに失敗しました。');
      }
    } catch (err) {
      setError('ログイン中にエラーが発生しました。');
      console.error('Demo login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {DEMO_ACCOUNTS.map((account) => (
        <button
          key={account.email}
          onClick={() => handleDemoLogin(account.email, account.password)}
          disabled={loading}
          type="button"
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2" />
              ログイン中...
            </div>
          ) : (
            <span>{account.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}