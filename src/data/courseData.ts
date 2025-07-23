export interface Lesson {
  id: string;
  title: string;
  type: 'lesson' | 'homework' | 'questions';
  contentPath?: string;
  videoUrl?: string;
  files?: string[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export const courseData: Section[] = [
  {
    id: 'section-1',
    title: 'Introduction, Theory and Basics',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Welcome to the exciting world of Affiliate Marketing!',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-1.md'
      },
      {
        id: 'lesson-1-2',
        title: 'The Art of Traffic Arbitrage: A Deep Dive',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-2.md'
      },
      {
        id: 'lesson-1-3',
        title: 'Main terms',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-3.md'
      },
      {
        id: 'lesson-1-4',
        title: 'Security on the Internet',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-4.md'
      },
      {
        id: 'lesson-1-5',
        title: 'Cloaking',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-5.md'
      },
      {
        id: 'lesson-1-6',
        title: 'Tracking',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-6.md'
      },
      {
        id: 'lesson-1-7',
        title: 'Accounts FB',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-7.md'
      },
      {
        id: 'lesson-1-8',
        title: 'Proven sellers, contacts',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-8.md'
      },
      {
        id: 'lesson-1-9',
        title: 'Choosing the Right Offer',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-1-9.md'
      },
      {
        id: 'homework-1-1',
        title: 'Practical Homework',
        type: 'homework',
        contentPath: '@/data/lessons/homework-1-1.md'
      }
    ]
  },
  {
    id: 'section-2',
    title: 'Preparing the infrastructure',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Spreadsheet tracker of FB accounts and script for statistics',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-1.md'
      },
      {
        id: 'lesson-2-2',
        title: 'Types of bans on Facebook',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-2.md'
      },
      {
        id: 'lesson-2-3',
        title: 'What is an antidetect browser?',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-3.md'
      },
      {
        id: 'lesson-2-4',
        title: 'What is a proxy server, why is it needed?',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-4.md'
      },
      {
        id: 'lesson-2-5',
        title: 'Adding a proxy to the anti-detection browser.',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-5.md'
      },
      {
        id: 'lesson-2-6',
        title: 'Preparation of FB accounts',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-6.md'
      },
      {
        id: 'lesson-2-7',
        title: 'Farming FB Account',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-7.md'
      },
      {
        id: 'lesson-2-8',
        title: 'Downloading any landings/sites',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-8.md'
      },
      {
        id: 'lesson-2-9',
        title: 'Setting up a Keitaro',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-9.md'
      },
      {
        id: 'lesson-2-10',
        title: 'Cloaking FB',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-10.md'
      },
      {
        id: 'lesson-2-11',
        title: 'Pre-landing',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-2-11.md'
      },
      {
        id: 'homework-2-1',
        title: 'Homework - Work with accounts and browser anti-detection',
        type: 'homework',
        contentPath: '@/data/lessons/homework-2-1.md'
      },
      {
        id: 'homework-2-2',
        title: 'Homework - Cloaking',
        type: 'homework',
        contentPath: '@/data/lessons/homework-2-2.md'
      }
    ]
  },
  {
    id: 'section-3',
    title: 'System Setup',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Where to get payment methods',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-1.md'
      },
      {
        id: 'lesson-3-2',
        title: 'Facebook Traffic Launch Checklist',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-2.md'
      },
      {
        id: 'lesson-3-3',
        title: 'Passing the Advertising Activity Ban (ZRD)',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-3.md'
      },
      {
        id: 'lesson-3-4',
        title: 'Basics of working with the affiliate network',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-4.md'
      },
      {
        id: 'lesson-3-5',
        title: 'Setting up postback with Affiliate networks',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-5.md'
      },
      {
        id: 'lesson-3-6',
        title: 'Pixel FB',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-6.md'
      },
      {
        id: 'lesson-3-7',
        title: 'SPY servis ADHeart',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-7.md'
      },
      {
        id: 'lesson-3-8',
        title: 'Types of creatives',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-8.md'
      },
      {
        id: 'lesson-3-9',
        title: 'Ideal customer profile - Prompt',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-9.md'
      },
      {
        id: 'lesson-3-10',
        title: 'SOP: Connecting an ad account to the BM',
        type: 'lesson',
        contentPath: '@/data/lessons/lesson-3-10.md'
      },
      {
        id: 'homework-3-1',
        title: 'Homework',
        type: 'homework',
        contentPath: '@/data/lessons/homework-3-1.md'
      }
    ]
  }
];