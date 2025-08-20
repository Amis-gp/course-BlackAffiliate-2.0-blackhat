import LessonLayoutClient from '@/app/lesson/LessonLayoutClient';
import { ProgressProvider } from '@/contexts/ProgressContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ProgressProvider>
        <LessonLayoutClient>
          {children}
        </LessonLayoutClient>
      </ProgressProvider>
    </ProtectedRoute>
  );
}