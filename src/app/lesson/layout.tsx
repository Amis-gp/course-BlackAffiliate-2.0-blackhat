import LessonLayoutClient from './LessonLayoutClient';
import { courseData } from '@/data/courseData';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ProgressProvider } from '@/contexts/ProgressContext';

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const navData = courseData.map(section => ({
    id: section.id,
    title: section.title,
    lessons: section.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
    })),
  }));

  return (
    <ProtectedRoute>
      <ProgressProvider>
        <LessonLayoutClient courseData={navData}>
          {children}
        </LessonLayoutClient>
      </ProgressProvider>
    </ProtectedRoute>
  );
}