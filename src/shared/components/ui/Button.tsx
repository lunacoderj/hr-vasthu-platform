import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Spinner } from './Spinner';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "disabled"> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      icon,
      iconPosition = 'left',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
      primary: 'bg-gold-500 text-white hover:bg-gold-600 focus:ring-gold-500 disabled:bg-stone-300 disabled:text-stone-500',
      secondary: 'bg-copper-500 text-white hover:bg-copper-600 focus:ring-copper-500 disabled:bg-stone-300 disabled:text-stone-500',
      tertiary: 'bg-transparent text-gold-600 border border-gold-500 hover:bg-gold-50 focus:ring-gold-500 dark:hover:bg-gold-900',
      ghost: 'bg-transparent text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 focus:ring-stone-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
      xl: 'h-14 px-8 text-xl',
    };

    const disabled = isDisabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { y: -1 } : {}}
        whileTap={!disabled ? { y: 0, scale: 0.98 } : {}}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
        {...props}
      >
        {isLoading && (
          <Spinner
            size="sm"
            variant={variant === 'primary' || variant === 'secondary' ? 'white' : 'primary'}
            className="mr-2"
          />
        )}
        
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="mr-2 flex items-center">{icon}</span>
        )}
        
        {children as React.ReactNode}
        
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="ml-2 flex items-center">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
