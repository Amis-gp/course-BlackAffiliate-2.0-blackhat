'use client';

import { X } from 'lucide-react';

interface AccessRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessRestrictionModal({ isOpen, onClose }: AccessRestrictionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-[#1a1d22] to-[#0f1012] rounded-2xl shadow-2xl max-w-md w-full border border-red-900/40 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-red-900/40 via-red-800/30 to-transparent flex items-center justify-between border-b border-red-900/30">
          <h3 className="text-lg font-bold text-white">Access Restricted</h3>
          <button
            onClick={onClose}
            className="text-red-300 hover:text-red-100 transition-all hover:rotate-90 duration-300"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6">
            <p className="text-gray-300 mb-4 text-center">
              Your access is limited to the <strong>"New method for bypassing creative moderation"</strong> lesson only.
            </p>
            <p className="text-sm text-gray-400 text-center mb-6">
              Access level: <span className="text-primary font-semibold">Creative Push Only</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://t.me/nayborovskiy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
              Contact for Access
            </a>
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

