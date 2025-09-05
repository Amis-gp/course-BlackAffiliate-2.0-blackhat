import { promises as fs } from 'fs';
import path from 'path';
import { courseData, Lesson } from '@/data/courseData';
import LessonPageClient from './LessonPageClient';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getLessonInfo = (id: string): Lesson | null => {
  for (const section of courseData) {
    const lesson = section.lessons.find(l => l.id === id);
    if (lesson) {
      return lesson;
    }
  }
  return null;
};

const getLessonContent = cache(async (id: string): Promise<string> => {
  const filePath = path.join(process.cwd(), 'public', 'lessons', `${id}.md`);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading lesson content for ${id}:`, error);
    throw new Error('Lesson content not found.');
  }
});

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lessonInfo = getLessonInfo(id);

  if (!lessonInfo) {
    notFound();
  }

  try {
    const lessonContent = await getLessonContent(id);
    const lesson = { ...lessonInfo, content: lessonContent };
    return <LessonPageClient initialLesson={lesson} />;
  } catch (error) {
     notFound();
  }
}