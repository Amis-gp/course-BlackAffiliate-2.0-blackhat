import LessonContent from '@/components/LessonContent';
import { courseData, Lesson } from '@/data/courseData';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import CourseNavigation from '@/components/CourseNavigation';

async function getLessonData(id: string) {
  const allLessons = courseData.flatMap(section => section.lessons);
  const lessonData = allLessons.find(l => l.id === id);

  if (!lessonData) {
    const notFoundLesson: Lesson = { 
      id, 
      title: 'Lesson not found', 
      type: 'lesson' 
    };
    return {
      lesson: notFoundLesson,
      content: '<p>Lesson content not found.</p>',
      headings: [],
    };
  }

  const fullPath = path.join(process.cwd(), 'public', 'lessons', `${id}.md`);
  
  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { content } = matter(fileContents);

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    const headings = Array.from(contentHtml.matchAll(/<h([1-6])>(.*?)<\/h\1>/g)).map((match: any) => ({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, ''),
      slug: match[2].replace(/<[^>]*>/g, '').toLowerCase().replace(/\s+/g, '-'),
    }));

    return {
      lesson: lessonData,
      content: contentHtml,
      headings,
    };
  } catch (error) {
    console.error(`Error reading lesson file for id: ${id}`, error);
    const errorLesson: Lesson = { 
        ...lessonData, 
        title: 'Error loading content' 
    };
    return {
      lesson: errorLesson,
      content: '<p>Could not load lesson content.</p>',
      headings: [],
    };
  }
}

export async function generateStaticParams() {
  const allLessons = courseData.flatMap(section => section.lessons);
  return allLessons.map(lesson => ({ id: lesson.id }));
}

export default async function LessonPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { id } = await paramsPromise;
  const { lesson, content, headings } = await getLessonData(id);

  const allLessons = courseData.flatMap(section => section.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === id);

  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : undefined;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : undefined;

  return (
    <div className="flex h-screen">
      <CourseNavigation currentLessonId={id} />
      <main className="flex-1 overflow-y-auto">
        <LessonContent 
          lesson={lesson} 
          content={content} 
          headings={headings}
          hasPrevious={!!previousLesson}
          hasNext={!!nextLesson}
        />
      </main>
    </div>
  );
}