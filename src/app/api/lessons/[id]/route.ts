import { NextRequest, NextResponse } from 'next/server';
import { courseData } from '@/data/courseData';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  let lesson;
  for (const section of courseData) {
    const foundLesson = section.lessons.find(l => l.id === id);
    if (foundLesson) {
      lesson = foundLesson;
      break;
    }
  }

  if (!lesson || !lesson.contentPath) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  try {
    const filename = path.basename(lesson.contentPath);
    const filePath = path.join(process.cwd(), 'public', 'lessons', filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    console.error(`Failed to read lesson content for ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to read lesson content' },
      { status: 500 },
    );
  }
}