import { getLesson } from '@/lib/lesson';
import { getCourseNavigationData } from '@/lib/course';
import LessonClientPage from './LessonClientPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [lessonData, courseData] = await Promise.all([
      getLesson(id),
      getCourseNavigationData(),
    ]);
    return <LessonClientPage lessonData={lessonData} courseData={courseData} />;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white">{errorMessage}</p>
      </div>
    );
  }
}