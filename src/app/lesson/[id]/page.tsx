import { getLesson } from '@/lib/lesson';
import LessonPage from './LessonPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const lessonData = await getLesson(id);

    if (!lessonData) {
      notFound();
    }

    return <LessonPage lessonData={lessonData} />;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white">{errorMessage}</p>
      </div>
    );
  }
}