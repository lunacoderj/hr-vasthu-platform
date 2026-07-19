import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  elevation = 'sm',
  padding = 'md',
  as: Component = 'div',
  className = '',
  children,
  ...props
}) => {
  const elevations = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <Component
      className={`
        bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 
        transition-shadow duration-300
        ${elevations[elevation]} 
        ${paddings[padding]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
