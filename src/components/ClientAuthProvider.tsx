'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect, useState, useRef } from 'react';

function AuthWrapper({ children }: { children: ReactNode }) {
  try {
    const { isInitializing } = useAuth();
    
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
    
    return <>{children}</>;
  } catch (error) {
    console.error('AuthWrapper error:', error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Initializing...</div>
        </div>
      </div>
    );
  }
}

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const hasMountedRef = useRef(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasMountedRef.current) {
    console.log('🔧 ClientAuthProvider: Mounting on client');
      hasMountedRef.current = true;
    setIsMounted(true);
    }
  }, []);
  
  useEffect(() => {
    if (hasMountedRef.current && !isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);
  
  if (typeof window === 'undefined') {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
      </AuthProvider>
    );
  }
  
  const shouldShowContent = isMounted || hasMountedRef.current;
  
  console.log('✅ ClientAuthProvider: Rendering, isMounted:', isMounted, 'hasMountedRef:', hasMountedRef.current, 'shouldShowContent:', shouldShowContent);
  
  return (
    <AuthProvider>
      {!shouldShowContent ? (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
      ) : (
        <AuthWrapper>{children}</AuthWrapper>
      )}
    </AuthProvider>
  );
}