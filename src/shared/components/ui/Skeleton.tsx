import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseStyles = 'bg-stone-200 dark:bg-stone-800 animate-pulse';
  
  let variantStyles = '';
  switch (variant) {
    case 'circular':
      variantStyles = 'rounded-full';
      break;
    case 'text':
      variantStyles = 'rounded h-4';
      break;
    case 'rectangular':
    default:
      variantStyles = 'rounded-xl';
      break;
  }

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {/* Optional inner shimmer effect if tailwind animate-pulse isn't enough */}
      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};
