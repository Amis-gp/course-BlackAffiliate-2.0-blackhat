'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Play, FileText, HelpCircle } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isLessonCompleted, completedLessons } = useProgress();
  const { user } = useAuth();

  useEffect(() => {
    const section = courseData.find(s => s.lessons.some(l => l.id === currentLessonId));
    if (section) {
      setExpandedSections([section.id]);
    } else if (courseData.length > 0) {
      setExpandedSections([courseData[0].id]);
    }
  }, [currentLessonId, courseData]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) ? [] : [sectionId]
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

  const filteredCourseData = user?.access_level === 6 
    ? courseData
        .map(section => {
          if (section.id === 'section-4') {
            return {
              ...section,
              lessons: section.lessons.filter(lesson => lesson.id === 'lesson-4-9')
            };
          }
          return null;
        })
        .filter((section): section is NavSection => section !== null && section.lessons.length > 0)
    : courseData;

  return (
    <div className="w-72 m-4 rounded-lg overflow-y-auto h-[calc(100vh-350px)] lg:h-auto">
      <div className="space-y-2">
        {filteredCourseData.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          
          return (
            <div key={section.id} className="border border-gray-800 rounded-lg">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-200 rounded-lg"
              >
                <span className="font-semibold text-white">{section.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-primary" />
                )}
              </button>
              
              {isExpanded && (
                <div className="border-t border-gray-800">
                  {section.lessons.map((lesson, index) => (
                    <Link
                      href={`/lesson/${lesson.id}`}
                      key={lesson.id}
                      onClick={() => onLessonSelect && onLessonSelect(lesson.id)}
                      className={`w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-800 transition-colors duration-200 ${isLessonCompleted(lesson.id) ? 'text-gray-500' : 'text-white'} ${currentLessonId === lesson.id ? 'bg-primary/20 border-r-2 border-primary' : ''}`}>
                      <span className={`${isLessonCompleted(lesson.id) ? 'text-gray-600' : 'text-primary'}`}>
                        {getLessonIcon(lesson.type)}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">#{index + 1}</div>
                        <div className={`text-sm ${isLessonCompleted(lesson.id) ? 'text-gray-500' : 'text-white'}`}>{lesson.title}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}