'use client';

import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY = 'course_progress';

export function useProgress() {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        setCompletedLessons(new Set(JSON.parse(savedProgress)));
      }
    } catch (error) {
      console.error('Failed to load progress from localStorage', error);
    }
  }, []);

  const saveProgress = (newCompleted: Set<string>) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(newCompleted)));
    } catch (error) {
      console.error('Failed to save progress to localStorage', error);
    }
  };

  const completeLesson = useCallback((lessonId: string) => {
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

  return { completeLesson, isLessonCompleted, completedLessons };
}