'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ReactNode, useEffect, useState } from 'react';

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    console.log('🔧 ClientAuthProvider: Mounting on client');
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    console.log('⏳ ClientAuthProvider: Not mounted yet, showing loading...');
    return <div>Loading...</div>;
  }
  
  console.log('✅ ClientAuthProvider: Mounted, rendering AuthProvider');
  return <AuthProvider>{children}</AuthProvider>;
}