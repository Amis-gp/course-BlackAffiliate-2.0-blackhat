import { getLesson } from '@/lib/lesson';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    const { content, headings, lesson } = await getLesson(lessonId);
    
    const response = new Response(JSON.stringify({ content, headings, lesson }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'ETag': `"${lessonId}-${lesson.version || '1'}"`,
      },
    });
    
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: message }), {
      status: message === 'Lesson not found' ? 404 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}