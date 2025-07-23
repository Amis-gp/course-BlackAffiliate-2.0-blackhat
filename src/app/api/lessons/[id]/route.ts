import { NextResponse } from 'next/server';
import { courseData } from '@/data/courseData';
import path from 'path';
import fs from 'fs/promises';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const lessonId = params.id;

  let lesson;
  for (const section of courseData) {
    const foundLesson = section.lessons.find(l => l.id === lessonId);
    if (foundLesson) {
      lesson = foundLesson;
      break;
    }
  }

  if (!lesson || !lesson.contentPath) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), 'src', lesson.contentPath.replace('@/', ''));
    const content = await fs.readFile(filePath, 'utf-8');

    const headings: { level: number; text: string; slug: string }[] = [];
    const processor = unified().use(remarkParse);
    const tree = processor.parse(content);

    visit(tree, 'heading', (node: any) => {
      const text = node.children.map((child: any) => child.value).join('');
      const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      headings.push({
        level: node.depth,
        text,
        slug
      });
    });

    return NextResponse.json({ content, headings });
  } catch (error) {
    console.error(`Failed to read lesson content for ${lessonId}:`, error);
    return NextResponse.json({ error: 'Failed to load lesson content' }, { status: 500 });
  }
}