import { NextResponse } from 'next/server';
import { courseData } from '@/data/courseData';
import path from 'path';
import fs from 'fs/promises';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: lessonId } = await params;

  console.log('=== LESSON API DEBUG START ===');
  console.log('Requested lesson ID:', lessonId);
  console.log('Process CWD:', process.cwd());
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Platform:', process.platform);

  let lesson;
  for (const section of courseData) {
    const foundLesson = section.lessons.find(l => l.id === lessonId);
    if (foundLesson) {
      lesson = foundLesson;
      break;
    }
  }

  if (!lesson) {
    console.log('Lesson not found in courseData');
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  console.log('Found lesson:', lesson);

  const possiblePaths = [
    path.resolve(process.cwd(), 'public', 'lessons', `${lessonId}.md`),
    path.resolve(process.cwd(), '.next', 'static', 'lessons', `${lessonId}.md`),
    path.resolve('/var/task', 'public', 'lessons', `${lessonId}.md`),
    path.resolve('/var/task', '.next', 'static', 'lessons', `${lessonId}.md`),
    path.resolve(__dirname, '..', '..', '..', '..', '..', 'public', 'lessons', `${lessonId}.md`),
    path.resolve(__dirname, '..', '..', '..', '..', '..', '.next', 'static', 'lessons', `${lessonId}.md`)
  ];

  console.log('Trying possible file paths:', possiblePaths);
  console.log('__dirname:', __dirname);
  console.log('Netlify env:', process.env.NETLIFY);
  console.log('Lambda task root:', process.env.LAMBDA_TASK_ROOT);

  let filePath: string | null = null;
  let fileContent: string | null = null;

  for (const testPath of possiblePaths) {
    try {
      console.log('Testing path:', testPath);
      await fs.access(testPath);
      console.log('Path exists:', testPath);
      fileContent = await fs.readFile(testPath, 'utf-8');
      filePath = testPath;
      console.log('Successfully read file from:', testPath, 'Content length:', fileContent.length);
      break;
    } catch (error) {
      console.log('Path failed:', testPath, 'Error:', (error as any)?.code || error);
    }
  }

  if (!filePath || !fileContent) {
    console.error('No valid file path found');
    return NextResponse.json({ 
      error: 'Lesson content file not found',
      lessonId,
      testedPaths: possiblePaths,
      debugInfo: {
        cwd: process.cwd(),
        dirname: __dirname,
        netlify: process.env.NETLIFY,
        lambdaTaskRoot: process.env.LAMBDA_TASK_ROOT
      }
    }, { status: 404 });
  }
  
  try {
    console.log('Processing file content, length:', fileContent.length);

    const headings: { level: number; text: string; slug: string }[] = [];
    const processor = unified().use(remarkParse);
    const tree = processor.parse(fileContent);

    const slugCounts: { [key: string]: number } = {};

    visit(tree, 'heading', (node: any) => {
      const text = node.children.map((child: any) => child.value).join('');
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

    console.log('Successfully processed lesson content');
    console.log('=== LESSON API DEBUG END ===');
    return NextResponse.json({ content: fileContent, headings });
  } catch (error) {
    console.error('=== LESSON API ERROR ===');
    console.error(`Failed to read lesson content for ${lessonId}:`, error);
    console.error('File path attempted:', filePath);
    console.error('Working directory:', process.cwd());
    console.error('Lesson object:', lesson);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error code:', (error as any)?.code);
    console.error('=== LESSON API ERROR END ===');
    return NextResponse.json({ 
      error: 'Failed to load lesson content',
      details: error instanceof Error ? error.message : 'Unknown error',
      lessonId,
      filePath,
      debugInfo: {
        cwd: process.cwd(),
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorCode: (error as any)?.code,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      }
    }, { status: 500 });
  }
}