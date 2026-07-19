import React from 'react';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'display';
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    display: 'heading-display text-stone-900 dark:text-ivory-50',
    h1: 'heading-h1 text-stone-900 dark:text-ivory-50',
    h2: 'heading-h2 text-stone-900 dark:text-ivory-50',
    h3: 'heading-h3 text-stone-900 dark:text-ivory-50',
    h4: 'heading-h4 text-stone-900 dark:text-ivory-50',
    h5: 'heading-h5 text-stone-900 dark:text-ivory-50',
    h6: 'heading-h6 text-stone-900 dark:text-ivory-50',
    body: 'text-body text-stone-700 dark:text-stone-300',
  };

  const Component = as || (variant === 'display' ? 'h1' : variant === 'body' ? 'p' : variant);

  return (
    <Component className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Typography;
