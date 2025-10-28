'use client';

import { Bell } from 'lucide-react';

interface AnnouncementsButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export default function AnnouncementsButton({
  unreadCount,
  onClick
}: AnnouncementsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-300 hover:text-white transition-colors"
      title="View announcements"
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}

