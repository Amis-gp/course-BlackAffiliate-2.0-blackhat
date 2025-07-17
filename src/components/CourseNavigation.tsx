'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Play, FileText, HelpCircle } from 'lucide-react';
import { courseData, Section, Lesson } from '@/data/courseData';

interface CourseNavigationProps {
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
}

export default function CourseNavigation({ currentLessonId, onLessonSelect }: CourseNavigationProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['section-1']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLessonIcon = (type: Lesson['type']) => {
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
    <div className="w-80 bg-gray-900 border-r border-gray-800 h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary mb-6">Course Navigation</h2>
        
        <div className="space-y-2">
          {courseData.map((section) => {
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
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson.id)}
                        className={`w-full p-3 text-left flex items-center space-x-3 hover:bg-gray-800 transition-colors duration-200 ${
                          currentLessonId === lesson.id ? 'bg-primary/20 border-r-2 border-primary' : ''
                        }`}
                      >
                        <span className="text-primary">
                          {getLessonIcon(lesson.type)}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-400">#{index + 1}</div>
                          <div className="text-white text-sm">{lesson.title}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}