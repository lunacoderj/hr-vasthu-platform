import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../../core/store/theme.store';
import { Button } from '../ui';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-2 rounded-full"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-gold-500" />
      ) : (
        <Moon className="w-5 h-5 text-stone-600" />
      )}
    </Button>
  );
};

export default ThemeToggle;
