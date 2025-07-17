'use client';

import { useState } from 'react';
import CourseNavigation from '@/components/CourseNavigation';
import LessonContent from '@/components/LessonContent';
import { courseData } from '@/data/courseData';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [currentLessonId, setCurrentLessonId] = useState<string>('lesson-1-1');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
    <div className="flex h-screen bg-black">
      <div className={`fixed inset-0 z-50 lg:relative lg:z-auto transition-transform duration-300 ${
        isMobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <CourseNavigation 
          currentLessonId={currentLessonId}
          onLessonSelect={handleLessonSelect}
        />
      </div>

      {isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-800 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="text-white hover:text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-primary">BlackAffiliate 2.0</h1>
            <div className="w-6" />
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col">
          <LessonContent 
            lesson={currentLesson}
            onPreviousLesson={handlePreviousLesson}
            onNextLesson={handleNextLesson}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        </main>
      </div>

      {isMobileNavOpen && (
        <button
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed top-4 right-4 z-50 bg-gray-900 text-white p-2 rounded-lg lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}