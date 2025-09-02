import { NextRequest, NextResponse } from 'next/server';
import { courseData } from '@/data/courseData';
import fs from 'fs';
import path from 'path';

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s:]+/g, '-')
    .replace(/[^a-z0-9\u0400-\u04FF-]+/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
};

const extractHeadings = (content: string): { level: number; text: string; slug: string }[] => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string; slug: string }[] = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = generateSlug(text);
    headings.push({ level, text, slug });
  }
  
  return headings;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
    const headings = extractHeadings(content);
    return NextResponse.json({ content, headings });
  } catch (error) {
    console.error(`Failed to read lesson content for ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to read lesson content' },
      { status: 500 },
    );
  }
}