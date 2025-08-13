'use client';

import { useState, useEffect } from 'react';
import { X, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageData {
  src: string;
  alt: string;
}

interface ImageModalProps {
  isOpen: boolean;
  images: ImageData[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export default function ImageModal({ isOpen, images, currentIndex, onClose, onNavigate }: ImageModalProps) {
  const [rotation, setRotation] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const currentImage = images[currentIndex] || { src: '', alt: '' };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setRotation(0);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;

        case 'r':
        case 'R':
          handleRotate();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);



  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePrevious = () => {
    if (images.length > 1 && currentIndex > 0 && onNavigate) {
      onNavigate(currentIndex - 1);
      resetTransform();
    }
  };

  const handleNext = () => {
    if (images.length > 1 && currentIndex < images.length - 1 && onNavigate) {
      onNavigate(currentIndex + 1);
      resetTransform();
    }
  };

  const resetTransform = () => {
    setRotation(0);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      handleNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      handlePrevious();
    }
  };





  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handleRotate}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          title="Rotate (R key)">
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          title="Close (Escape key)">
          <X className="w-5 h-5" />
        </button>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full z-10 transition-all hidden md:block ${
              currentIndex === 0
                ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            title="Previous image (left arrow)">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === images.length - 1}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full z-10 transition-all hidden md:block ${
              currentIndex === images.length - 1
                ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            title="Next image (right arrow)">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
        {images.length > 1 && (
          <span>{currentIndex + 1} / {images.length}</span>
        )}
      </div>

      <div
        className="w-full h-full flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-full transition-transform duration-200 select-none"
          style={{
            transform: `rotate(${rotation}deg)`
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}