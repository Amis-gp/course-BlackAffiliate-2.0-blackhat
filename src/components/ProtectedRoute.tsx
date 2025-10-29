'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isInitializing, user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  
  console.log('🛡️ ProtectedRoute: Current state:', { isAuthenticated, isInitializing });

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    useEffect(() => {
      if (user && user.access_level === 5) {
        window.location.href = '/service-unavailable';
      }
    }, [user]);

    if (user && user.access_level === 5) {
      return null;
    }
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
          <h1 className="text-2xl font-bold text-white mb-4">Access denied</h1>
          <p className="text-gray-400">You do not have administrator rights to access this page</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}