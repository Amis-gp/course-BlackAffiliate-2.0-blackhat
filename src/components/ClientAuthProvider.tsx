'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect, useState } from 'react';
import { LoadingScreen } from './LoadingScreen';

function AuthWrapper({ children }: { children: ReactNode }) {
  const { isInitializing } = useAuth();
  
  if (isInitializing) {
    return <LoadingScreen />;
  }
  
  return <>{children}</>;
}

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    console.log('🔧 ClientAuthProvider: Mounting on client');
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    console.log('⏳ ClientAuthProvider: Not mounted yet, showing loading...');
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }
  
  console.log('✅ ClientAuthProvider: Mounted, rendering AuthProvider');
  return (
    <AuthProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </AuthProvider>
  );
}