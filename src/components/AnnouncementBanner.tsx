'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { AnnouncementWithReadStatus } from '@/types/announcements';

interface AnnouncementBannerProps {
  announcements: AnnouncementWithReadStatus[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
}

export default function AnnouncementBanner({
  announcements,
  onMarkAsRead,
  onClose
}: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const unreadAnnouncements = announcements.filter(a => !a.is_read);

  useEffect(() => {
    if (unreadAnnouncements.length === 0) {
      setIsVisible(false);
    }
  }, [unreadAnnouncements.length]);

  if (!isVisible || unreadAnnouncements.length === 0) {
    return null;
  }

  const currentAnnouncement = unreadAnnouncements[currentIndex];
  const hasMore = currentIndex < unreadAnnouncements.length - 1;

  const handleMarkAsRead = () => {
    onMarkAsRead(currentAnnouncement.id);
    if (hasMore) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsVisible(false);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-[#0f1012] text-white shadow-2xl border border-red-900/40 rounded-xl max-w-sm w-[92vw] sm:w-96 overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-red-900/30 to-transparent flex items-center justify-between">
          <h3 className="text-sm font-semibold truncate pr-2">{currentAnnouncement.title}</h3>
          <button
            onClick={handleClose}
            className="text-red-300 hover:text-red-200 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {currentAnnouncement.image_url && (
          <img
            src={currentAnnouncement.image_url}
            alt={currentAnnouncement.title}
            className="w-full max-h-40 object-cover border-b border-red-900/30"
          />
        )}

        <div className="px-4 py-3">
          <p className="text-white/90 text-sm mb-3 whitespace-pre-wrap">
            {currentAnnouncement.content}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAsRead}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
            >
              Mark as Read
            </button>
            {hasMore && (
              <>
                <button
                  onClick={handleNext}
                  className="bg-[#1a1d22] hover:bg-[#22262c] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 border border-red-900/40"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-white/60 text-xs ml-auto">
                  {currentIndex + 1} / {unreadAnnouncements.length}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

