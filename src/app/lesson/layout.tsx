import { getCourseNavigationData } from '@/lib/course';
import LessonLayoutClient from '@/app/lesson/LessonLayoutClient';
import { ProgressProvider } from '@/contexts/ProgressContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default async function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const courseData = await getCourseNavigationData();
  return (
    <ProtectedRoute>
      <ProgressProvider>
        <LessonLayoutClient courseData={courseData}>
          {children}
        </LessonLayoutClient>
      </ProgressProvider>
    </ProtectedRoute>
  );
}