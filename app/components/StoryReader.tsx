'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { StoryPage } from '@/app/lib/types';
import FontSizeSettings, { FontSize } from './FontSizeSettings';

const FONT_SIZE_STORAGE_KEY = 'liams-books-font-size';

interface StoryReaderProps {
  pages: StoryPage[];
  slug: string;
  title: string;
}

const fontSizeClasses: Record<FontSize, string> = {
  small: 'text-sm sm:text-base md:text-story-sm',
  medium: 'text-base sm:text-story-base md:text-story-lg',
  large: 'text-lg sm:text-story-lg md:text-xl',
};

export default function StoryReader({ pages, slug, title }: StoryReaderProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const totalPages = pages.length;

  // Load font size preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    if (saved && ['small', 'medium', 'large'].includes(saved)) {
      setFontSize(saved as FontSize);
    }
  }, []);

  // Save font size preference to localStorage
  const handleFontSizeChange = useCallback((size: FontSize) => {
    setFontSize(size);
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
  }, []);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setDirection(pageIndex > currentPage ? 1 : -1);
      setCurrentPage(pageIndex);
      setImageLoading(true);
    }
  }, [currentPage, totalPages]);

  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
      setImageLoading(true);
    }
  }, [currentPage, totalPages]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
      setImageLoading(true);
    }
  }, [currentPage]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Keyboard navigation including Escape to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, router]);

  // Swipe handling
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      goNext();
    } else if (info.offset.x > swipeThreshold) {
      goPrev();
    }
  };

  const page = pages[currentPage];

  // Animation variants for page transitions
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  return (
    <div className="relative">
      {/* Settings */}
      <div className="flex justify-end mb-2">
        <FontSizeSettings fontSize={fontSize} onFontSizeChange={handleFontSizeChange} />
      </div>

      {/* Page Content */}
      <div className="relative overflow-hidden min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing touch-pan-y"
          >
            <div className="space-y-4 sm:space-y-6">
              {page.image && (
                <motion.div 
                  className="w-full relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Image Loading Skeleton */}
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-sepia-light/50 rounded-lg animate-pulse">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-sepia border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <Image
                    src={`/Stories/${slug}/${page.image}`}
                    alt={`${title} - Page ${currentPage + 1}`}
                    width={800}
                    height={600}
                    className={`w-full h-auto rounded-lg shadow-page max-h-[45vh] sm:max-h-[50vh] md:max-h-[60vh] object-contain mx-auto transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    draggable={false}
                    onLoad={() => setImageLoading(false)}
                    priority={currentPage === 0}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                  />
                </motion.div>
              )}
              {page.text && (
                <motion.div 
                  className="max-w-3xl mx-auto px-2 sm:px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className={`${fontSizeClasses[fontSize]} text-text-primary text-center leading-relaxed sm:leading-loose transition-all duration-200`}>
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-3 sm:mb-4 leading-relaxed sm:leading-loose">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-text-primary">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                      }}
                    >
                      {page.text}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
        {/* Previous Button */}
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className={`
            p-3 sm:p-4 rounded-full transition-all duration-200 touch-manipulation
            ${currentPage === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:bg-sepia-light active:scale-95 active:bg-sepia-light hover:shadow-book'
            }
          `}
          aria-label="Previous page"
        >
          <svg 
            className="w-7 h-7 sm:w-8 sm:h-8 text-text-secondary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>

        {/* Progress Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {totalPages <= 10 ? (
            // Dot indicators for 10 or fewer pages
            pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`
                  w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 touch-manipulation
                  ${index === currentPage 
                    ? 'bg-sepia-dark scale-125' 
                    : 'bg-sepia-light hover:bg-sepia active:bg-sepia'
                  }
                `}
                aria-label={`Go to page ${index + 1}`}
              />
            ))
          ) : (
            // Page numbers for more than 10 pages
            <span className="text-text-secondary font-display text-base sm:text-lg min-w-[60px] text-center">
              {currentPage + 1} / {totalPages}
            </span>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={goNext}
          disabled={currentPage === totalPages - 1}
          className={`
            p-3 sm:p-4 rounded-full transition-all duration-200 touch-manipulation
            ${currentPage === totalPages - 1 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:bg-sepia-light active:scale-95 active:bg-sepia-light hover:shadow-book'
            }
          `}
          aria-label="Next page"
        >
          <svg 
            className="w-7 h-7 sm:w-8 sm:h-8 text-text-secondary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </button>
      </div>

      {/* Navigation hints */}
      <p className="text-center text-text-muted text-xs sm:text-sm mt-3 sm:mt-4">
        <span className="hidden sm:inline">Use arrow keys, swipe, or </span>
        <span className="sm:hidden">Swipe or </span>
        tap arrows to navigate
        <span className="hidden md:inline"> · Esc to return</span>
      </p>
    </div>
  );
}
