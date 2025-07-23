'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { courseData } from '@/data/courseData';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (courseData.length > 0 && courseData[0].lessons.length > 0) {
      const firstLessonId = courseData[0].lessons[0].id;
      router.replace(`/lesson/${firstLessonId}`);
    }
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white">Loading course...</p>
      </div>
    </ProtectedRoute>
  );
}