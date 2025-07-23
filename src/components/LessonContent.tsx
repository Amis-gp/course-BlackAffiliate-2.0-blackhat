'use client';

import { useState, useEffect } from 'react';
import { Play, FileText, HelpCircle, Download } from 'lucide-react';
import { Lesson } from '@/data/courseData';
import Footer from '@/components/Footer';
import { useProgress } from '@/contexts/ProgressContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LessonContentProps {
  lesson: Lesson;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export default function LessonContent({ lesson, onPreviousLesson, onNextLesson, hasPrevious, hasNext }: LessonContentProps) {
  const { completeLesson } = useProgress();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpent = endTime - startTime;

      if (timeSpent >= 10000) {
        completeLesson(lesson.id);
      }
    };
  }, [lesson.id, completeLesson]);

  useEffect(() => {
    if (lesson.contentPath) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/lessons/${lesson.id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch lesson content');
          }
          return res.json();
        })
        .then(data => {
          setContent(data.content);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Could not load lesson content. Please try again later.');
          setIsLoading(false);
        });
    } else {
      setContent('Content for this lesson will be available soon.');
      setIsLoading(false);
    }
  }, [lesson.id, lesson.contentPath]);

  const getLessonTypeInfo = (type: Lesson['type']) => {
    switch (type) {
      case 'lesson':
        return {
          icon: <Play className="w-6 h-6" />,
          label: 'Lesson',
          bgColor: 'bg-blue-600'
        };
      case 'homework':
        return {
          icon: <FileText className="w-6 h-6" />,
          label: 'Homework',
          bgColor: 'bg-green-600'
        };
      case 'questions':
        return {
          icon: <HelpCircle className="w-6 h-6" />,
          label: 'Questions',
          bgColor: 'bg-purple-600'
        };
      default:
        return {
          icon: <Play className="w-6 h-6" />,
          label: 'Content',
          bgColor: 'bg-gray-600'
        };
    }
  };

  const typeInfo = getLessonTypeInfo(lesson.type);

  return (
    <div className='flex-1 overflow-y-auto flex justify-between flex-col'>
      <div className="max-w-4xl mx-auto pb-8 pt-4 px-4 sm:p-8 w-full">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
              {typeInfo.icon}
            </div>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              {typeInfo.label}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {lesson.title}
          </h1>
        </div>

        {lesson.videoUrl && (
          <div className="mb-8">
            <div className="aspect-video bg-[#0f1012] rounded-lg border border-gray-800 overflow-hidden">
              <video 
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              >
                <source src={lesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-[#0f1012] border border-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-primary mb-4">Lesson Overview</h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({node, ...props}) => <img {...props} className="rounded-lg mx-auto" />
                  }}
                >
                  {content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>

        {lesson.files && lesson.files.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-primary mb-4">Additional Materials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.files.map((file, index) => (
                <div key={index} className="bg-[#0f1012] border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-white">{file}</span>
                  </div>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}



        <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-800">
          <button 
            className={`btn-secondary ${!hasPrevious ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onPreviousLesson}
            disabled={!hasPrevious}
          >
            ← Previous Lesson
          </button>
          <button 
            className={`btn-primary ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onNextLesson}
            disabled={!hasNext}
          >
            Next Lesson →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}