'use client';

import { useState, useEffect } from 'react';
import { Play, FileText, HelpCircle, Download, List, ChevronRight } from 'lucide-react';
import { Lesson } from '@/data/courseData';
import Footer from '@/components/Footer';
import { useProgress } from '@/contexts/ProgressContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface LessonContentProps {
  lesson: Lesson;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export default function LessonContent({ lesson, onPreviousLesson, onNextLesson, hasPrevious, hasNext }: LessonContentProps) {
  const { completeLesson, uncompleteLesson, isLessonCompleted } = useProgress();
  const [content, setContent] = useState('');
  const [headings, setHeadings] = useState<{ level: number; text: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCompleted = isLessonCompleted(lesson.id);

  const handleToggleComplete = () => {
    if (isCompleted) {
      uncompleteLesson(lesson.id);
    } else {
      completeLesson(lesson.id);
    }
  };

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
          setHeadings(data.headings || []);
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
    <div className='flex-1 overflow-y-auto flex flex-col min-h-full'>
      <div className="max-w-4xl mx-auto pt-6 px-4 sm:t-8 w-full flex-1">
          <div className="w-full">
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

        {headings.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50 shadow-lg">
                <h4 className="text-base font-semibold text-white pb-2">Lesson navigation</h4>
                <div className="space-y-1">
                    {headings.map((heading, index) => (
                        <div key={heading.slug} className="group">
                            <a 
                                href={`#${heading.slug}`} 
                                className="flex items-center justify-between p-3 rounded-lg text-gray-300 hover:bg-gray-700/40 hover:text-white transition-all duration-200 group-hover:translate-x-1"
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-300 group-hover:bg-primary group-hover:text-white transition-colors">
                                        {index + 1}
                                    </div>
                                    <span className="font-medium">{heading.text}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-[#0f1012] border border-gray-800 rounded-lg p-6">
            <h3 className="text-base font-semibold text-primary mt-0">Lesson Overview</h3>
            
            <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none">
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    img: ({node, ...props}) => <img {...props} className="rounded-lg mx-auto" />,
                    h1: ({node, ...props}) => (
                      <div className="mb-8">
                        <h1 
                          id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} 
                          className="text-3xl font-bold text-white mb-4 pb-3 border-b-2 border-primary/30"
                          {...props} 
                        />
                      </div>
                    ),
                    h2: ({node, ...props}) => (
                        <div className="mb-6 mt-12 pt-8 border-t border-gray-800">
                          <h2 
                            id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} 
                            className="text-2xl font-semibold text-white mb-3  relative"
                            {...props} 
                          />
                          <div className="w-16 h-1 bg-primary rounded-full"></div>
                        </div>
                      ),
                    h3: ({node, ...props}) => (
                      <h3 
                        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} 
                        className="text-xl font-semibold text-gray-100 mb-3 mt-6 pb-1 border-b border-gray-700/50"
                        {...props} 
                      />
                    ),
                    h4: ({node, ...props}) => (
                      <h4 
                        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} 
                        className="text-lg font-medium text-gray-200 mb-2 mt-5"
                        {...props} 
                      />
                    ),
                    h5: ({node, ...props}) => (
                      <h5 
                        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} 
                        className="text-base font-medium text-gray-300 mb-2 mt-4"
                        {...props} 
                      />
                    ),
                    h6: ({node, ...props}) => (
                      <h6 
                        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')} 
                        className="text-sm font-medium text-gray-400 mb-2 mt-3"
                        {...props} 
                      />
                    ),
                    hr: ({node, ...props}) => (
                      <div className="my-8 flex items-center">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                        <div className="mx-4 w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                      </div>
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-gray-300 leading-relaxed mb-4" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="text-white font-semibold" {...props} />
                    ),
                    em: ({node, ...props}) => (
                      <em className="text-gray-200 italic" {...props} />
                    ),
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

        <div className="py-16 border-t border-gray-800/30">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-center md:justify-between">
              <button 
                className={`group flex items-center justify-center space-x-3 px-8 py-3 rounded-xl font-medium transition-all duration-300 w-full md:w-auto ${
                  !hasPrevious 
                    ? 'opacity-30 cursor-not-allowed text-gray-600' 
                    : 'text-gray-400 hover:text-white bg-gray-900/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/70 backdrop-blur-sm'
                }`}
                onClick={onPreviousLesson}
                disabled={!hasPrevious}
              >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300 text-lg">←</span>
                <span className="text-sm">Previous Lesson</span>
              </button>
              
              <button 
                onClick={handleToggleComplete}
                className={`group relative px-8 py-4 rounded-2xl font-medium text-base transition-all duration-500 ease-out w-full md:w-auto ${
                  isCompleted 
                    ? 'bg-emerald-50/5 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-50/10 hover:border-emerald-400/40 shadow-lg shadow-emerald-500/10' 
                    : 'bg-blue-50/5 text-blue-400 border border-blue-400/20 hover:bg-blue-50/10 hover:border-blue-400/40 shadow-lg shadow-blue-500/10'
                } backdrop-blur-sm`}>
                <span className="flex items-center justify-center space-x-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? 'border-emerald-400 bg-emerald-400/20' 
                      : 'border-blue-400 bg-transparent group-hover:bg-blue-400/10'
                  }`}>
                    {isCompleted && <span className="text-emerald-400 text-xs">✓</span>}
                  </span>
                  <span>{isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}</span>
                </span>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isCompleted ? 'bg-emerald-400/5' : 'bg-blue-400/5'
                }`}></div>
              </button>
              
              <button 
                className={`group flex items-center justify-center space-x-3 px-8 py-3 rounded-xl font-medium transition-all duration-300 w-full md:w-auto ${
                  !hasNext 
                    ? 'opacity-30 cursor-not-allowed text-gray-600' 
                    : 'text-gray-400 hover:text-white bg-gray-900/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/70 backdrop-blur-sm'
                }`}
                onClick={onNextLesson}
                disabled={!hasNext}
              >
                <span className="text-sm">Next Lesson</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300 text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}