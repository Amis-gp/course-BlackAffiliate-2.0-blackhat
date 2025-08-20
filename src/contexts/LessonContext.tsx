import { createContext, useContext } from 'react';
import { Section, Lesson } from '@/data/courseData';

export interface NavLesson {
  id: string;
  title: string;
  isLocked: boolean;
  type: 'lesson' | 'homework' | 'questions';
}

export interface NavSection {
  id: string;
  title: string;
  lessons: NavLesson[];
}

export interface LessonContextType {
  course: Section[] | null;
  currentLesson: Lesson | null;
  navSections: NavSection[];
  handleNextLesson: () => void;
  handlePreviousLesson: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function useLessonContext() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLessonContext must be used within a LessonProvider');
  }
  return context;
}