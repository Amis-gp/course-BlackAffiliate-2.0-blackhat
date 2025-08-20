'use client';

import dynamic from 'next/dynamic';
import { Lesson } from '@/data/courseData';
import { useLessonContext } from '@/contexts/LessonContext';

const LessonContent = dynamic(() => import('@/components/LessonContent'));

interface LessonPageProps {
  lessonData: {
    content: string;
    headings: { level: number; text: string; slug: string }[];
    lesson: Lesson;
  };
}

export default function LessonPage({ lessonData }: LessonPageProps) {
  const { lesson, content, headings } = lessonData;
  const { handlePreviousLesson, handleNextLesson, hasPrevious, hasNext } = useLessonContext();

  return (
    <LessonContent 
      lesson={lesson}
      content={content}
      headings={headings}
      onPreviousLesson={handlePreviousLesson}
      onNextLesson={handleNextLesson}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
    />
  );
}