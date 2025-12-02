import { NextRequest, NextResponse } from 'next/server';
import { courseData } from '@/data/courseData';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

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

  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

  if (authError || !authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(authUser.id);
  
  if (userError || !userData) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const accessLevel = userData.user.user_metadata?.access_level || 1;

  if (accessLevel === 6 && id !== 'lesson-4-9') {
    return NextResponse.json({ error: 'Access denied. Your access is limited to the "New method for bypassing creative moderation" lesson only. Your access level: Creative Push Only' }, { status: 403 });
  }

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