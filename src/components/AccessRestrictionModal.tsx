'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface AccessRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessRestrictionModal({ isOpen, onClose }: AccessRestrictionModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#0f1012] border border-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            Your access is limited to the "New method for bypassing creative moderation" lesson only.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <span className="font-semibold">Access level:</span> Creative Push Only
          </p>
          <p className="text-gray-300">
            To get access to this lesson, please contact us:
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href="https://t.me/Mar_ko_y"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#0088cc] hover:bg-[#006ba3] text-white px-6 py-3 rounded-lg transition-colors text-center font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.201 1.647-1.073 5.647-1.514 7.477-.172.74-.51 1.017-.837 1.041-.706.057-1.243-.465-1.928-.91-1.068-.693-1.673-1.124-2.708-1.8-1.201-.785-.423-1.216.262-1.92.179-.18 3.247-2.977 3.307-3.23.008-.031.015-.148-.057-.207-.072-.059-.177-.038-.254-.023-.109.023-1.844 1.174-5.204 3.447-.493.343-.939.509-1.34.5-.442-.011-1.29-.249-1.92-.454-.773-.254-1.388-.388-1.335-.82.028-.216.406-.438 1.117-.668 4.448-1.938 7.407-3.215 8.876-3.832 4.183-1.783 5.049-2.093 5.616-2.106.127-.003.411.029.595.172.165.129.211.302.233.421.022.119.048.39.027.601z"/>
            </svg>
            Contact on Telegram
          </a>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

