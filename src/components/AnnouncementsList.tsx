'use client';

import { AnnouncementWithReadStatus } from '@/types/announcements';
import { CheckCircle, Circle, X } from 'lucide-react';

interface AnnouncementsListProps {
  announcements: AnnouncementWithReadStatus[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
}

export default function AnnouncementsList({
  announcements,
  onMarkAsRead,
  onClose
}: AnnouncementsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Announcements</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No announcements yet</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
                  announcement.is_read
                    ? 'border-gray-600'
                    : 'border-red-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => !announcement.is_read && onMarkAsRead(announcement.id)}
                    className={`mt-1 flex-shrink-0 ${
                      announcement.is_read
                        ? 'text-gray-500 cursor-default'
                        : 'text-red-500 hover:text-red-400 cursor-pointer'
                    }`}
                    disabled={announcement.is_read}
                  >
                    {announcement.is_read ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        announcement.is_read ? 'text-gray-300' : 'text-white'
                      }`}>
                        {announcement.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(announcement.created_at)}
                      </span>
                    </div>

                    <p className={`text-sm whitespace-pre-wrap ${
                      announcement.is_read ? 'text-gray-400' : 'text-gray-300'
                    }`}>
                      {announcement.content}
                    </p>

                    {announcement.image_url && (
                      <div className="mt-3">
                        <img
                          src={announcement.image_url}
                          alt={announcement.title}
                          className="max-h-64 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

