'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ToolsSections from '@/components/ToolsSections';
import { toolsData } from '@/data/toolsData';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ToolsPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Tools</h1>
            <p className="text-gray-400">Essential services for traffic arbitrage and affiliate marketing</p>
          </div>

          <ToolsSections tools={toolsData} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
