import { courseData, Lesson } from '@/data/courseData';
import LessonPageClient from './LessonPageClient';

interface LessonPageProps {
  params: {
    id: string;
  };
}

const getLesson = (id: string): Lesson | null => {
  for (const section of courseData) {
    const lesson = section.lessons.find(l => l.id === id);
    if (lesson) {
      return lesson;
    }
  }
  return null;
};

export default function LessonPage({ params }: LessonPageProps) {
  const { id } = params;
  const initialLesson = getLesson(id);

  return <LessonPageClient initialLesson={initialLesson} />;
}