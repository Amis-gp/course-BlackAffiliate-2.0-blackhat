'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const PROGRESS_KEY = 'course_progress';

type ProgressContextType = {
  completedLessons: Set<string>;
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      console.log('Loading progress from localStorage:', savedProgress);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (Array.isArray(parsed) && parsed.every(s => typeof s === 'string')) {
          setCompletedLessons(new Set(parsed));
          console.log('Successfully loaded progress:', parsed);
        } else {
          console.error('Invalid progress data format');
          localStorage.removeItem(PROGRESS_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load progress from localStorage', error);
      localStorage.removeItem(PROGRESS_KEY);
    }
  }, []);

  const saveProgress = (newCompleted: Set<string>) => {
    try {
      const data = JSON.stringify(Array.from(newCompleted));
      console.log('Saving progress to localStorage:', data);
      localStorage.setItem(PROGRESS_KEY, data);
    } catch (error) {
      console.error('Failed to save progress to localStorage', error);
    }
  };

  const completeLesson = useCallback((lessonId: string) => {
    console.log('Completing lesson:', lessonId);
    setCompletedLessons(prev => {
      const newCompleted = new Set(prev);
      newCompleted.add(lessonId);
      saveProgress(newCompleted);
      return newCompleted;
    });
  }, []);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return completedLessons.has(lessonId);
  }, [completedLessons]);

  return (
    <ProgressContext.Provider value={{ completedLessons, completeLesson, isLessonCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (undefined === context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}