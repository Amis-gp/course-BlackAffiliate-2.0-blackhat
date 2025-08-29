'use client';

import { createContext, useContext } from 'react';

interface NavLesson {
  id: string;
  title: string;
  type: 'lesson' | 'homework' | 'questions';
}

interface NavSection {
  id: string;
  title: string;
  lessons: NavLesson[];
}

interface LessonContextType {
    courseData: NavSection[];
    currentLessonId: string;
    handlePreviousLesson: () => void;
    handleNextLesson: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

export const LessonContext = createContext<LessonContextType | null>(null);

export const useLessonContext = () => {
    const context = useContext(LessonContext);
    if (!context) {
        throw new Error('useLessonContext must be used within a LessonProvider');
    }
    return context;
};