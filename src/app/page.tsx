'use client';

import { useState } from 'react';
import CourseNavigation from '@/components/CourseNavigation';
import LessonContent from '@/components/LessonContent';
import ProtectedRoute from '@/components/ProtectedRoute';
import { courseData } from '@/data/courseData';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [currentLessonId, setCurrentLessonId] = useState<string>('lesson-1-1');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const getCurrentLesson = () => {
    for (const section of courseData) {
      const lesson = section.lessons.find(l => l.id === currentLessonId);
      if (lesson) return lesson;
    }
    return courseData[0].lessons[0];
  };

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
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
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
    }
  };

  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex">
        {/* Mobile Navigation Overlay */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileNavOpen(false)} />
        )}
        
        {/* Sidebar Navigation */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white lg:block hidden">Course Navigation</h2>
            <h2 className="text-lg font-semibold text-white lg:hidden">Course Navigation</h2>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          
          
          <CourseNavigation 
            currentLessonId={currentLessonId} 
            onLessonSelect={(lessonId) => {
              setCurrentLessonId(lessonId);
              setIsMobileNavOpen(false);
            }} 
          />{/* User Info and Controls */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Увійшли як:</div>
            <div className="text-white font-medium mb-3">{user?.email}</div>
            <div className="flex flex-col gap-2">
              {isAdmin() && (
                <Link href="/admin" className="flex items-center gap-2 text-sm bg-primary hover:bg-red-700 px-3 py-2 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  Адмін панель
                </Link>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Вийти
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="text-white hover:text-gray-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
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

          {/* Lesson Content */}
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
    </ProtectedRoute>
  );
}