import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const baseClasses = 'paper-texture rounded-lg p-6 transition-all duration-300';
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:shadow-book-hover hover:-translate-y-1' 
    : '';
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
