'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Card from './Card';
import { Story } from '@/app/lib/types';

interface BookGridProps {
  stories: Story[];
}

// Individual book cover component with loading state
function BookCover({ story }: { story: Story }) {
  const [imageLoading, setImageLoading] = useState(true);
  
  if (!story.metadata.coverImage) {
    return (
      <div className="mb-3 sm:mb-4 w-full aspect-[3/4] bg-sepia-light rounded-lg shadow-book flex items-center justify-center group-hover:shadow-book-hover transition-shadow duration-300">
        <motion.span 
          className="text-text-muted text-4xl sm:text-5xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          📖
        </motion.span>
      </div>
    );
  }

  return (
    <div className="mb-3 sm:mb-4 w-full aspect-[3/4] overflow-hidden rounded-lg shadow-book group-hover:shadow-book-hover transition-shadow duration-300 relative">
      {/* Loading skeleton */}
      {imageLoading && (
        <div className="absolute inset-0 bg-sepia-light animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-sepia border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <motion.div
        className="w-full h-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={`/Stories/${story.slug}/${story.metadata.coverImage}`}
          alt={story.metadata.title}
          fill
          className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setImageLoading(false)}
          draggable={false}
        />
      </motion.div>
    </div>
  );
}

export default function BookGrid({ stories }: BookGridProps) {
  // Animation variants for staggered book appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const bookVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (stories.length === 0) {
    return (
      <motion.div 
        className="text-center py-12 sm:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-text-secondary text-base sm:text-lg mb-3 sm:mb-4">
          No stories found yet.
        </p>
        <p className="text-text-muted text-sm sm:text-base">
          Add some story folders to the Stories directory to get started!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {stories.map((story) => (
        <motion.div key={story.slug} variants={bookVariants}>
          <Link href={`/story/${story.slug}`} className="block touch-manipulation">
            <motion.div
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="h-full flex flex-col items-center text-center group p-4 sm:p-6">
                <BookCover story={story} />
                <h2 className="text-lg sm:text-xl font-display text-text-primary mb-1 sm:mb-2 group-hover:text-sepia-dark transition-colors line-clamp-2">
                  {story.metadata.title}
                </h2>
                {story.metadata.author && (
                  <p className="text-text-secondary text-xs sm:text-sm mb-1 sm:mb-2">
                    {story.metadata.author}
                  </p>
                )}
                <p className="text-text-muted text-xs">
                  {story.pages.length} {story.pages.length === 1 ? 'page' : 'pages'}
                </p>
              </Card>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
