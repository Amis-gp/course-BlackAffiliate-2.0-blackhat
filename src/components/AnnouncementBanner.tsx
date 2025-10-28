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
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">{currentAnnouncement.title}</h3>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-white/90 text-sm mb-3 whitespace-pre-wrap">
                {currentAnnouncement.content}
              </p>

              {currentAnnouncement.image_url && (
                <div className="mb-3">
                  <img
                    src={currentAnnouncement.image_url}
                    alt={currentAnnouncement.title}
                    className="max-h-48 rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkAsRead}
                  className="bg-white text-red-600 hover:bg-gray-100 px-4 py-2 rounded font-medium text-sm transition-colors"
                >
                  Mark as Read
                </button>

                {hasMore && (
                  <>
                    <button
                      onClick={handleNext}
                      className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded font-medium text-sm transition-colors flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-white/70 text-sm">
                      {currentIndex + 1} of {unreadAnnouncements.length}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

