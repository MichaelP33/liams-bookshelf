import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  type = 'button'
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-sepia-dark text-white hover:bg-sepia-dark/90 active:bg-sepia-dark/80',
    secondary: 'bg-sepia-light text-text-primary hover:bg-sepia active:bg-sepia',
    ghost: 'bg-transparent text-text-primary hover:bg-sepia-light/50 active:bg-sepia-light/70',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-display
        transition-all duration-200
        shadow-book hover:shadow-book-hover
        active:scale-95
        touch-manipulation
        ${className}
      `}
    >
      {children}
    </button>
  );
}
