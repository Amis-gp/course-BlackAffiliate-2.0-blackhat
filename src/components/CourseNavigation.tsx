'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Play, FileText, HelpCircle } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/AuthContext';
import AccessRestrictionModal from '@/components/AccessRestrictionModal';

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

interface CourseNavigationProps {
  courseData: NavSection[];
  currentLessonId?: string;
  onLessonSelect?: (lessonId: string) => void;
}

export default function CourseNavigation({ courseData, currentLessonId, onLessonSelect }: CourseNavigationProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const { isLessonCompleted, completedLessons } = useProgress();
  const { user } = useAuth();

  const isLevel6 = user?.access_level === 6;

  useEffect(() => {
    if (isLevel6) {
      const section4 = courseData.find(s => s.id === 'section-4');
      if (section4) {
        setExpandedSections(['section-4']);
      }
    } else {
      const section = courseData.find(s => s.lessons.some(l => l.id === currentLessonId));
      if (section) {
        setExpandedSections([section.id]);
      } else if (courseData.length > 0) {
        setExpandedSections([courseData[0].id]);
      }
    }
  }, [currentLessonId, courseData, isLevel6]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const getLessonIcon = (type: NavLesson['type']) => {
    switch (type) {
      case 'lesson':
        return <Play className="w-4 h-4" />;
      case 'homework':
        return <FileText className="w-4 h-4" />;
      case 'questions':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="w-72 m-4 rounded-lg overflow-y-auto h-[calc(100vh-350px)] lg:h-auto">
        <div className="space-y-2">
          {courseData.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            const isSection4 = section.id === 'section-4';
            const isDimmed = isLevel6 && !isSection4;
            
            return (
              <div 
                key={section.id} 
                className={`border rounded-lg transition-all duration-200 ${
                  isDimmed 
                    ? 'border-gray-900/50 opacity-50' 
                    : isSection4 && isLevel6
                    ? 'border-primary/50 shadow-lg shadow-primary/10'
                    : 'border-gray-800'
                }`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full p-4 text-left flex items-center justify-between transition-colors duration-200 rounded-lg ${
                    isDimmed
                      ? 'hover:bg-gray-900/50'
                      : isSection4 && isLevel6
                      ? 'bg-primary/10 hover:bg-primary/20'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <span className={`font-semibold ${
                    isSection4 && isLevel6
                      ? 'text-primary'
                      : isDimmed
                      ? 'text-gray-500'
                      : 'text-white'
                  }`}>
                    {section.title}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className={`w-5 h-5 ${
                      isSection4 && isLevel6
                        ? 'text-primary'
                        : isDimmed
                        ? 'text-gray-600'
                        : 'text-primary'
                    }`} />
                  ) : (
                    <ChevronRight className={`w-5 h-5 ${
                      isSection4 && isLevel6
                        ? 'text-primary'
                        : isDimmed
                        ? 'text-gray-600'
                        : 'text-primary'
                    }`} />
                  )}
                </button>
              
              {isExpanded && (
                <div className="border-t border-gray-800">
                  {section.lessons.map((lesson, index) => {
                    const isDisabled = isLevel6 && lesson.id !== 'lesson-4-9';
                    const isActive = currentLessonId === lesson.id;
                    
                    const lessonContent = (
                      <div className={`w-full p-3 text-left flex items-center space-x-3 transition-colors duration-200 ${isDisabled ? 'opacity-50 cursor-not-allowed' : isActive ? 'bg-primary/20 border-r-2 border-primary' : 'hover:bg-gray-800'} ${isLessonCompleted(lesson.id) ? 'text-gray-500' : 'text-white'}`}>
                        <span className={`${isDisabled || isLessonCompleted(lesson.id) ? 'text-gray-600' : 'text-primary'}`}>
                          {getLessonIcon(lesson.type)}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-400">#{index + 1}</div>
                          <div className={`text-sm ${isDisabled || isLessonCompleted(lesson.id) ? 'text-gray-500' : 'text-white'}`}>{lesson.title}</div>
                        </div>
                      </div>
                    );
                    
                    return isDisabled ? (
                      <div 
                        key={lesson.id}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowAccessModal(true);
                        }}
                        className="cursor-pointer"
                        title="Click to learn more about access"
                      >
                        {lessonContent}
                      </div>
                    ) : (
                      <Link
                        href={`/lesson/${lesson.id}`}
                        key={lesson.id}
                        onClick={() => onLessonSelect && onLessonSelect(lesson.id)}
                      >
                        {lessonContent}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>

      <AccessRestrictionModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
      />
    </>
  );
}