import React, { type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
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
        
        <textarea
          id={generatedId}
          ref={ref}
          className={`
            w-full rounded-md border text-base outline-none transition-colors
            bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100
            placeholder:text-stone-400 dark:placeholder:text-stone-500
            p-3 min-h-[100px] resize-y
            ${
              error
                ? 'border-copper-500 focus:border-copper-500 focus:ring-1 focus:ring-copper-500'
                : 'border-stone-300 dark:border-stone-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 hover:border-stone-400 dark:hover:border-stone-600'
            }
            ${props.disabled ? 'bg-stone-50 dark:bg-stone-800 text-stone-500 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        
        {error && <p className="text-sm text-copper-500">{error}</p>}
        {hint && !error && <p className="text-sm text-stone-500 dark:text-stone-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
