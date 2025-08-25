'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import MiroBoard from '@/components/MiroBoard';

console.log('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Course Roadmap</h1>
            <p className="text-gray-300 text-lg">Your path to success in Black Hat marketing</p>
          </div>
          <MiroBoard />
          
          <div className="text-center">
            <Link 
              href="/lesson/lesson-1-1" 
              className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}