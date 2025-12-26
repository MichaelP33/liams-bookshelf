'use client';

import { motion } from 'framer-motion';

// Configurable bookshelf name via environment variable
const bookshelfName = process.env.NEXT_PUBLIC_BOOKSHELF_NAME || "Liam's Bookshelf";

export default function BookshelfHeader() {
  return (
    <header className="text-center mb-8 sm:mb-10 md:mb-12 relative">
      {/* Decorative elements - hidden on very small screens */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        {/* Left decoration */}
        <motion.div
          className="absolute -left-2 sm:-left-4 top-0 text-3xl sm:text-4xl md:text-5xl opacity-30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ✨
        </motion.div>
        
        {/* Right decoration */}
        <motion.div
          className="absolute -right-2 sm:-right-4 top-0 text-3xl sm:text-4xl md:text-5xl opacity-30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          ✨
        </motion.div>
        
        {/* Floating stars */}
        <motion.div
          className="absolute left-1/4 top-1/2 text-xl sm:text-2xl opacity-20"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⭐
        </motion.div>
        
        <motion.div
          className="absolute right-1/4 top-1/3 text-lg sm:text-xl opacity-20"
          animate={{ 
            y: [0, -8, 0],
            opacity: [0.15, 0.35, 0.15]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          ⭐
        </motion.div>
      </div>

      {/* Main title with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Book emoji decoration */}
        <motion.div
          className="text-3xl sm:text-4xl mb-3 sm:mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.3 
          }}
        >
          📚
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display text-text-primary mb-3 sm:mb-4 relative px-2">
          <span className="relative">
            {bookshelfName}
            {/* Underline decoration */}
            <motion.div
              className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-sepia to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </span>
        </h1>

        <motion.p 
          className="text-text-secondary text-sm sm:text-base md:text-lg lg:text-xl max-w-md mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          A cozy collection of stories to read and enjoy
        </motion.p>
      </motion.div>

      {/* Decorative divider */}
      <motion.div 
        className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-sepia" />
        <span className="text-sepia text-sm sm:text-base">❦</span>
        <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-sepia" />
      </motion.div>
    </header>
  );
}
