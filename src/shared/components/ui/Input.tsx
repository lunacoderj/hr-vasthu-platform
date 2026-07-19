import React, { type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      className = '',
      wrapperClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = id || React.useId();
    
    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={generatedId} className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {label}
            {props.required && <span className="text-copper-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-stone-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          
          <input
            id={generatedId}
            ref={ref}
            className={`
              w-full rounded-md border text-base outline-none transition-colors
              bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100
              placeholder:text-stone-400 dark:placeholder:text-stone-500
              ${leftIcon ? 'pl-10' : 'pl-3'}
              ${rightIcon ? 'pr-10' : 'pr-3'}
              ${
                error
                  ? 'border-copper-500 focus:border-copper-500 focus:ring-1 focus:ring-copper-500'
                  : 'border-stone-300 dark:border-stone-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 hover:border-stone-400 dark:hover:border-stone-600'
              }
              ${props.disabled ? 'bg-stone-50 dark:bg-stone-800 text-stone-500 cursor-not-allowed' : ''}
              py-2
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 text-stone-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && <p className="text-sm text-copper-500">{error}</p>}
        {hint && !error && <p className="text-sm text-stone-500 dark:text-stone-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
