'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isInitializing } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showRegister) {
      return <RegisterForm />;
    }
    return (
      <LoginForm 
        onRegisterClick={() => setShowRegister(true)}
      />
    );
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Доступ заборонено</h1>
          <p className="text-gray-400">У вас немає прав адміністратора для доступу до цієї сторінки</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}