import { cache } from 'react';
import { courseData } from '@/data/courseData';
import path from 'path';
import fs from 'fs/promises';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import type { Heading } from 'mdast';

export const getLesson = cache(async (lessonId: string) => {
  let lesson;
  for (const section of courseData) {
    const foundLesson = section.lessons.find(l => l.id === lessonId);
    if (foundLesson) {
      lesson = foundLesson;
      break;
    }
  }

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  const possiblePaths = [
    path.resolve(process.cwd(), 'public', 'lessons', `${lessonId}.md`),
    path.resolve(process.cwd(), '.next', 'static', 'lessons', `${lessonId}.md`),
    path.resolve('/var/task', 'public', 'lessons', `${lessonId}.md`),
    path.resolve('/var/task', '.next', 'static', 'lessons', `${lessonId}.md`),
    path.resolve(__dirname, '..', '..', '..', '..', '..', 'public', 'lessons', `${lessonId}.md`),
    path.resolve(__dirname, '..', '..', '..', '..', '..', '.next', 'static', 'lessons', `${lessonId}.md`)
  ];

  let fileContent: string | null = null;

  for (const testPath of possiblePaths) {
    try {
      fileContent = await fs.readFile(testPath, 'utf-8');
      break;
   } catch {
      // ignore
    }
  }

  if (fileContent === null) {
    throw new Error('Lesson content file not found');
  }

  const headings: { level: number; text: string; slug: string }[] = [];
  const processor = unified().use(remarkParse);
  const tree = processor.parse(fileContent);

  const slugCounts: { [key: string]: number } = {};

  visit(tree, 'heading', (node: Heading) => {
    const text = toString(node);
    let slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    if (slugCounts[slug]) {
      slugCounts[slug]++;
      slug = `${slug}-${slugCounts[slug]}`;
    } else {
      slugCounts[slug] = 1;
    }

    headings.push({
      level: node.depth,
      text,
      slug
    });
  });

  return { content: fileContent, headings, lesson };
});