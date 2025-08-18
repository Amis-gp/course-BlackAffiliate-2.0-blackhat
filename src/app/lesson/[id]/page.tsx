'use client';

import { useState } from 'react';
import CourseNavigation from '@/components/CourseNavigation';
import LessonContent from '@/components/LessonContent';
import ProtectedRoute from '@/components/ProtectedRoute';
import { courseData } from '@/data/courseData';
import { useAuth } from '@/contexts/AuthContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { Menu, X, Settings, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function LessonPage() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const params = useParams();
  const router = useRouter();
  const currentLessonId = params?.id as string;

  const getCurrentLesson = () => {
    for (const section of courseData) {
      const lesson = section.lessons.find(l => l.id === currentLessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  const handleLessonSelect = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
    setIsMobileNavOpen(false);
  };

  const getAllLessons = () => {
    const allLessons: Array<{id: string, sectionId: string}> = [];
    courseData.forEach(section => {
      section.lessons.forEach(lesson => {
        allLessons.push({id: lesson.id, sectionId: section.id});
      });
    });
    return allLessons;
  };

  const allLessons = getAllLessons();
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const currentLesson = getCurrentLesson();

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      router.push(`/lesson/${allLessons[currentLessonIndex - 1].id}`);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      router.push(`/lesson/${allLessons[currentLessonIndex + 1].id}`);
    }
  };

  if (!currentLesson) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-white">Lesson not found.</p>
        </div>
      </ProtectedRoute>
    );
  }

  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  return (
    <ProtectedRoute>
      <ProgressProvider>
      <div className="min-h-screen bg-background flex relative">
        {isMobileNavOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileNavOpen(false)} />
        )}
        
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-[#0f1012] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white lg:block hidden">Course Navigation</h2>
            <h2 className="text-lg font-semibold text-white lg:hidden">Course Navigation</h2>
            <button onClick={() => setIsMobileNavOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <CourseNavigation 
            currentLessonId={currentLessonId}
            onLessonSelect={handleLessonSelect}
          />
          <div className="p-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Logged in as:</div>
            <div className="text-white font-medium mb-3">{user?.email}</div>
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors">
                <Home className="w-4 h-4" />
                Back to Roadmap
              </Link>
              {isAdmin() && (
                <Link href="/admin" className="flex items-center gap-2 text-sm bg-primary hover:bg-red-700 px-3 py-2 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <button onClick={logout} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="lg:hidden bg-[#0f1012] border-b border-gray-700 p-4 flex justify-between items-center relative z-10">
            <button onClick={() => setIsMobileNavOpen(true)} className="text-white hover:text-gray-300">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Link href="/" className="text-blue-400 hover:text-blue-300">
                <Home className="w-5 h-5" />
              </Link>
              {isAdmin() && (
                <Link href="/admin" className="text-primary hover:text-red-400">
                  <Settings className="w-5 h-5" />
                </Link>
              )}
              <button onClick={logout} className="text-gray-400 hover:text-white">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1">
            <LessonContent 
              lesson={currentLesson}
              onPreviousLesson={handlePreviousLesson}
              onNextLesson={handleNextLesson}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
            />
          </div>
        </div>
      </div>
      </ProgressProvider>
    </ProtectedRoute>
  );
}