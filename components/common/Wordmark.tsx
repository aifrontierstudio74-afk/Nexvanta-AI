import React from 'react';
import Link from 'next/link';

interface WordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
}

export const Wordmark: React.FC<WordmarkProps> = ({
  className = '',
  size = 'md',
  asLink = true,
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-3xl md:text-4xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 font-heading font-black tracking-tight select-none ${className}`}>
      {/* SVG Emblem: Hexagonal AI Node */}
      <svg
        className={size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="7"
          fill="#11131F"
          stroke="rgba(245, 197, 24, 0.4)"
          strokeWidth="1.5"
        />
        <path
          d="M9 23V9L17.5 19.5V9H22V23L13.5 12.5V23H9Z"
          fill="#F5C518"
        />
      </svg>
      <span className={`${sizeClasses[size]} font-bold`}>
        <span className="text-text">Nexvanta</span>
        <span className="text-gold">.AI</span>
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
