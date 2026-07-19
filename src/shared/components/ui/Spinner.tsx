import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'stone';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantMap = {
  primary: 'text-gold-500',
  white: 'text-white',
  stone: 'text-stone-500',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  return (
    <Loader2
      className={`animate-spin ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      aria-label="Loading"
      role="status"
    />
  );
};

export default Spinner;
