'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

export default function LoginForm({ onSuccess, onRegisterClick }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [remindMessage, setRemindMessage] = useState('');
  const { login, isLoading, remindAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🚀 LoginForm: Form submitted');
    e.preventDefault();
    
    console.log('🧹 LoginForm: Clearing previous state');
    setError('');
    setIsPending(false);
    setRequestId(null);
    setRemindMessage('');

    if (!credentials.email || !credentials.password) {
      console.log('⚠️ LoginForm: Empty fields validation failed');
      setError('Будь ласка, заповніть всі поля');
      return;
    }

    console.log('📝 LoginForm: Credentials validated, calling login function');
    try {
      const result = await login(credentials);
      console.log('📨 LoginForm: Login function returned result:', result);
      
      if (result.success) {
        console.log('✅ LoginForm: Login successful, calling onSuccess');
        setError('');
        onSuccess?.();
        return;
      }

      if (result.isPending && result.requestId) {
        console.log('⏳ LoginForm: Account pending approval');
        setIsPending(true);
        setRequestId(result.requestId);
        setError('');
      } else if (!result.success) {
        console.log('❌ LoginForm: Login failed, setting error message');
        const errorMessage = result.message || 'Невірний email або пароль.';
        console.log('📝 LoginForm: Error message:', errorMessage);
        setError(errorMessage);
        setIsPending(false);
        setRequestId(null);
      }
    } catch (err) {
      console.error('💥 LoginForm: Catch block - Login error in component:', err);
      setError('Сталася помилка при спробі входу. Спробуйте ще раз.');
      setIsPending(false);
      setRequestId(null);
    }
    
    console.log('🏁 LoginForm: handleSubmit completed');
  };

  const handleRemindAdmin = async () => {
    if (!requestId) return;
    
    try {
      const result = await remindAdmin(requestId);
      setRemindMessage(result.message);
    } catch (err) {
      console.error('Remind error:', err);
      setRemindMessage('Помилка відправки нагадування');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Вхід до курсу</h2>
          <p className="text-gray-400">Введіть свої дані для доступу</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Введіть пароль"
                required
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {isPending && (
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-lg">
              <p className="mb-3">Ваш акаунт ще не підтверджений адміністратором. Очікуйте підтвердження.</p>
              <button
                type="button"
                onClick={handleRemindAdmin}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Нагадати про себе
              </button>
              {remindMessage && (
                <p className="mt-2 text-sm text-yellow-200">{remindMessage}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">
            Немає акаунту?{' '}
            <button
              onClick={onRegisterClick}
              className="text-primary hover:text-red-400 transition-colors font-medium"
            >
              Зареєструватися
            </button>
          </p>
          

        </div>
      </div>
    </div>
  );
}