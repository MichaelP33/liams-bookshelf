'use client';

import { useState, useRef, useEffect } from 'react';

export type FontSize = 'small' | 'medium' | 'large';

interface FontSizeSettingsProps {
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
}

const fontSizeOptions: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
];

export default function FontSizeSettings({ fontSize, onFontSizeChange }: FontSizeSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.stopPropagation();
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Gear Icon Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-full text-text-muted hover:text-text-secondary hover:bg-sepia-light/50 transition-colors duration-200"
        aria-label="Text size settings"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 bg-cream border border-sepia-light rounded-lg shadow-book p-3 z-50"
        >
          <div className="flex flex-col gap-2">
            <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
              Text Size
            </span>
            <div className="flex gap-1">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onFontSizeChange(option.value);
                  }}
                  className={`
                    px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
                    ${fontSize === option.value
                      ? 'bg-sepia text-text-primary'
                      : 'bg-sepia-light/50 text-text-secondary hover:bg-sepia-light'
                    }
                  `}
                  aria-pressed={fontSize === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
