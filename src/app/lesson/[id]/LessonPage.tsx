'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Lesson } from '@/data/courseData';

const LessonContent = dynamic(() => import('@/components/LessonContent'));

interface LessonPageProps {
  lessonData: {
    content: string;
    headings: { level: number; text: string; slug: string }[];
    lesson: Lesson;
  };
}

export default function LessonPage({ lessonData }: LessonPageProps) {
  const router = useRouter();
  const { lesson, content, headings } = lessonData;

  // Dummy handlers, real implementation is in the layout
  const handlePreviousLesson = () => {};
  const handleNextLesson = () => {};

  return (
    <LessonContent 
      lesson={lesson}
      content={content}
      headings={headings}
      onPreviousLesson={handlePreviousLesson}
      onNextLesson={handleNextLesson}
      hasPrevious={false} // This will be handled by the context/layout in a real app
      hasNext={false} // This will be handled by the context/layout in a real app
    />
  );
}