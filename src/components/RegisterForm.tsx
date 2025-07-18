'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterForm() {
  const { register, getRegistrationRequests } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isResent, setIsResent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль повинен містити мінімум 6 символів');
      setIsLoading(false);
      return;
    }

    try {
      const existingRequestBefore = getRegistrationRequests().find(r => r.email === formData.email && r.status === 'pending');
      const success = await register(formData);
      
      if (success) {
        if (existingRequestBefore) {
          setIsResent(true);
        } else {
          setIsRegistered(true);
        }
      } else {
        setError('Користувач з таким email вже існує');
      }
    } catch (error) {
      setError('Помилка при реєстрації. Спробуйте ще раз.');
    }

    setIsLoading(false);
  };

  if (isRegistered || isResent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <div className="bg-green-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isResent ? 'Запит повторно надіслано!' : 'Запит надіслано!'}
            </h2>
            <p className="text-gray-300 mb-6">
              {isResent 
                ? 'Ваш запит на реєстрацію повторно надіслано адміністратору. Запит вже існує і очікує підтвердження.'
                : 'Ваш запит на реєстрацію надіслано адміністратору. Ви отримаєте доступ до курсу після підтвердження.'
              }
            </p>
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">Ваш email:</p>
              <p className="text-white font-medium">{formData.email}</p>
            </div>
            <p className="text-sm text-gray-400">
              Адміністратор отримав сповіщення в Telegram і розгляне ваш запит найближчим часом.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Реєстрація</h1>
          <p className="text-gray-400">Створіть акаунт для доступу до курсу</p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email адреса
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Введіть пароль"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Підтвердження паролю
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Повторіть пароль"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Зареєструватися
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Вже маєте акаунт?{' '}
              <a href="/" className="text-primary hover:text-red-400 transition-colors">
                Увійти
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}