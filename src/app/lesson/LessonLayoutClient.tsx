'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import CourseNavigation from '@/components/CourseNavigation';
import { useAuth } from '@/contexts/AuthContext';
import AccessControl from '@/components/AccessControl';
import { Menu, X, Settings, LogOut, Home, Map, Tag, Wrench } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavLesson {
  id: string;
  title: string;
  type: 'lesson' | 'homework' | 'questions';
}

interface NavSection {
  id: string;
  title: string;
  lessons: NavLesson[];
}

interface LessonContextType {
    courseData: NavSection[];
    currentLessonId: string;
    handlePreviousLesson: () => void;
    handleNextLesson: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
}

const LessonContext = createContext<LessonContextType | null>(null);

export const useLessonContext = () => {
    const context = useContext(LessonContext);
    if (!context) {
        throw new Error('useLessonContext must be used within a LessonLayoutClient');
    }
    return context;
};

interface LessonLayoutClientProps {
  courseData: NavSection[];
  children: React.ReactNode;
}

export default function LessonLayoutClient({ courseData, children }: LessonLayoutClientProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentLessonId = pathname.split('/').pop() || '';

  const handleLessonSelect = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
    setIsMobileNavOpen(false);
  };

  const allLessons = courseData.flatMap(section => section.lessons.map(lesson => ({ id: lesson.id })));
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLessonId);

  // Preload next lesson
  useEffect(() => {
    const nextLessonIndex = currentLessonIndex + 1;
    if (nextLessonIndex < allLessons.length) {
      const nextLessonId = allLessons[nextLessonIndex].id;
      // Preload next lesson content
      router.prefetch(`/lesson/${nextLessonId}`);
    }
  }, [currentLessonIndex, allLessons, router]);

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      router.push(`/lesson/${allLessons[currentLessonIndex - 1].id}`);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      router.push(`/lesson/${allLessons[currentLessonIndex + 1].id}`);
    }
  };

  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  return (
    <LessonContext.Provider value={{ courseData, currentLessonId, handlePreviousLesson, handleNextLesson, hasPrevious, hasNext }}>
      <div className="min-h-[100svh] bg-background flex relative">
        {isMobileNavOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileNavOpen(false)} />
        )}
        
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-[#0f1012] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Navigation</h2>
              <button onClick={() => setIsMobileNavOpen(false)} className="text-gray-400 hover:text-white lg:hidden">
                <X className="w-6 h-6" />
              </button>
            </div>

            <Link href="/" className="mx-4 mt-4 flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-3 rounded-lg transition-colors text-white font-medium">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <CourseNavigation 
              courseData={courseData}
              currentLessonId={currentLessonId}
              onLessonSelect={handleLessonSelect}
            />
              
            <div className='px-4 pb-4 border-b border-gray-700'>
              <div className="grid grid-cols-3 gap-4">
                <AccessControl requiredLevel={3} fallback={
                  <div 
                    className="flex flex-col items-center gap-1 text-xs bg-gray-600 px-2 py-2 rounded-lg text-white font-medium cursor-not-allowed opacity-50"
                    title="VIP Only"
                  >
                    <Map className="w-4 h-4" />
                    <span className="text-center">Road Map</span>
                  </div>
                }>
                  <a
                    href="https://miro.com/app/board/uXjVJP7Hcs8=/?embedMode=view_only_without_ui&moveToViewport=-51326,-112706,83650,46586&embedId=621168039653"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-xs bg-red-600 hover:bg-red-700 px-2 py-2 rounded-lg transition-colors text-white font-medium"
                  >
                    <Map className="w-4 h-4" />
                    <span className="text-center">Road Map</span>
                  </a>
                </AccessControl>
                <Link href="/offers" className="flex flex-col items-center justify-center gap-1 text-xs bg-orange-600 hover:bg-orange-700 px-2 py-2 rounded-lg transition-colors text-white font-medium">
                  <Tag className="w-4 h-4" />
                  <span className="text-center">Offers</span>
                </Link>
                <AccessControl requiredLevel={2} fallback={
                  <div 
                    className="flex flex-col items-center gap-1 text-xs bg-gray-600 px-2 py-2 rounded-lg text-white font-medium cursor-not-allowed opacity-50"
                    title="Premium+"
                  >
                    <Wrench className="w-4 h-4" />
                    <span className="text-center">Tools</span>
                  </div>
                }>
                  <Link href="/tools" className="flex flex-col items-center gap-1 text-xs bg-green-600 hover:bg-green-700 px-2 py-2 rounded-lg transition-colors text-white font-medium">
                    <Wrench className="w-4 h-4" />
                    <span className="text-center">Tools</span>
                  </Link>
                </AccessControl>
              </div>
            </div>
            <div className="p-4 mt-auto">
              <div className="text-sm text-gray-400 mb-2">Logged in as:</div>
              <div className="text-white font-medium mb-3">{user?.email}</div>
              <div className="flex flex-col gap-2">
                {isAdmin() && (
                  <Link href="/admin" className="flex items-center gap-2 text-sm bg-primary hover:bg-red-700 px-3 py-2 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button onClick={logout} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="lg:hidden bg-[#0f1012] border-b border-gray-700 p-4 flex justify-between items-center relative z-10">
            <button onClick={() => setIsMobileNavOpen(true)} className="text-white hover:text-gray-300">
              <Menu className="w-6 h-6" />
            </button>
            <Link 
              href="/" 
              className="text-white hover:text-red-400 transition-colors" 
              title="Home"
            >
              <Home className="w-6 h-6" />
            </Link>
          </div>

          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </LessonContext.Provider>
  );
}