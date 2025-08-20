import { unstable_cache } from 'next/cache';
import { courseData } from '@/data/courseData';

export const getCourseData = unstable_cache(
  async () => {
    return courseData;
  },
  ['courseData'],
  {
    revalidate: 3600, // Revalidate every hour
  }
);

export const getCourseNavigationData = unstable_cache(
  async () => {
    return courseData.map(section => ({
      id: section.id,
      title: section.title,
      lessons: section.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
      })),
    }));
  },
  ['courseNavigationData'],
  {
    revalidate: 3600, // Revalidate every hour
  }
);