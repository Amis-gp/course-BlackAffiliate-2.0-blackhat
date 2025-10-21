'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AccessControl from '@/components/AccessControl';
import Link from 'next/link';
import { ArrowRight, Play, FileText, HelpCircle, Map, Tag, Wrench } from 'lucide-react';
import { courseData } from '@/data/courseData';

console.log('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-64 md:h-[443px] bg-[url('/img/hero.webp')] bg-cover bg-center opacity-80 border-b-4 border-black"></div>
          <div className="absolute top-64 md:top-[443px] left-0 right-0 h-8 md:h-20 lg:h-32 bg-gradient-to-b from-red-500/15 via-red-400/5 to-transparent"></div>
          <div className="absolute top-64 md:top-[443px] left-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-r from-red-500/15 via-red-400/5 to-transparent"></div>
          <div className="absolute top-64 md:top-[443px] right-0 bottom-0 w-8 md:w-20 lg:w-32 bg-gradient-to-l from-red-500/15 via-red-400/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="container mx-auto px-4 py-6 md:py-12">
              <div className="text-center mb-8 md:mb-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
                  Black Affiliate
                </h1>
                <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 md:mb-12 px-4">
                  Traffic arbitrage and affiliate marketing training program
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-8 md:mb-12">
                  <AccessControl requiredLevel={3} fallback={
                    <div className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg shadow-lg cursor-not-allowed opacity-50">
                      <Map className="w-5 h-5" />
                      <span>Road Map (VIP Only)</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  }>
                    <a 
                      href="https://miro.com/app/board/uXjVJP7Hcs8=/?embedMode=view_only_without_ui&moveToViewport=-51326,-112706,83650,46586&embedId=621168039653" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 ease-out"
                    >
                      <Map className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Road Map</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  </AccessControl>
                  
                  <Link 
                    href="/offers"
                    className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 ease-out"
                  >
                    <Tag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Offers</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  
                  <AccessControl requiredLevel={2} fallback={
                    <div className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg shadow-lg cursor-not-allowed opacity-50">
                      <Wrench className="w-5 h-5" />
                      <span>Tools (Premium+)</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  }>
                    <Link 
                      href="/tools"
                      className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 ease-out"
                    >
                      <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Tools</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </AccessControl>
                </div>
              </div>

              <div className="grid gap-4 md:gap-6 max-w-4xl mx-auto px-4">
                {courseData.map((section, index) => {
                  const moduleNumber = index + 1;
                  const moduleImage = `/img/module-${moduleNumber}.webp`;
                  
                  return (
                    <div key={section.id} className="group">
                      <Link href={`/lesson/${section.lessons[0]?.id}`}>
                        <div className="bg-[#0f1012] rounded-lg overflow-hidden hover:bg-gradient-to-r hover:from-gray-800/90 hover:to-red-900/20 hover:shadow-lg hover:shadow-red-500/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                          <div className="flex flex-col sm:flex-row items-center">
                            <div className="w-full sm:w-32 md:w-40 h-24 sm:h-24 md:h-32 p-2 md:p-4 flex items-center justify-center flex-shrink-0">
                              <img 
                                src={moduleImage} 
                                alt={`Module ${moduleNumber}`}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<span class="text-xl md:text-3xl font-bold text-white">${moduleNumber}</span>`;
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1 px-4 md:px-6 py-3 md:py-4 text-center sm:text-left">
                              <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                                Module {moduleNumber} - {section.title.replace(/^\d+\.\s*/, '')}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {section.lessons.length} lessons
                              </p>
                            </div>
                            <div className="px-4 md:px-6 pb-3 sm:pb-0">
                              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-red-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}