/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors
      colors: {
        gold: {
          50: '#fef9f0',
          100: '#fdebd7',
          200: '#fcd7ae',
          300: '#f4a95c',
          400: '#e68a1c',
          500: '#d4720a',
          600: '#b35a07',
          700: '#8e4607',
          800: '#7a3b07',
          900: '#6a3205',
        },
        copper: {
          50: '#fef8f5',
          100: '#fce7e0',
          200: '#f8d0c4',
          300: '#e89a7f',
          400: '#d9714a',
          500: '#c85d2f',
          600: '#a84825',
          700: '#8a3a1f',
          800: '#6d2e18',
          900: '#5a2614',
        },
        ivory: {
          50: '#fffbf7',
          100: '#fef5ed',
          200: '#fce7d7',
          300: '#f9d9c3',
          400: '#f0c7a8',
          500: '#e8b896',
          600: '#d9a07f',
          700: '#c08d68',
          800: '#9e7152',
          900: '#7a5640',
        },
        marble: {
          50: '#fdfcfb',
          100: '#faf8f6',
          200: '#f5f1ed',
          300: '#ede6e0',
          400: '#ddd2c8',
          500: '#cbc0b5',
          600: '#b5a89d',
          700: '#9d9089',
          800: '#76706b',
          900: '#5a5550',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29f',
          500: '#78716b',
          600: '#57534e',
          700: '#44403c',
          800: '#292520',
          900: '#1c1917',
        },
        sage: {
          50: '#f6faf6',
          100: '#e8f1e8',
          200: '#d0e3d0',
          300: '#b0d4b0',
          400: '#7db87d',
          500: '#5d9d5d',
          600: '#4a7f4a',
          700: '#3d673d',
          800: '#2f5230',
          900: '#254025',
        },
        terracotta: {
          50: '#fdf8f6',
          100: '#f9e8e1',
          200: '#f0d0c3',
          300: '#d9956e',
          400: '#c17043',
          500: '#a85230',
          600: '#8a4225',
          700: '#6f341e',
          800: '#572816',
          900: '#47200f',
        },
        indigo: {
          50: '#f5f7fd',
          100: '#e8eef9',
          200: '#d5dff3',
          300: '#b8cde8',
          400: '#7e9dd9',
          500: '#4c5f99',
          600: '#3d4a7a',
          700: '#303d62',
          800: '#2a334d',
          900: '#1a2740',
        },
      },

      // Typography
      fontFamily: {
        display: ["'Source Serif Pro'", 'Georgia', 'serif'],
        heading: ["'Lora'", 'Georgia', 'serif'],
        body: ["'Inter'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ["'Monaco'", "'Menlo'", 'monospace'],
      },

      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
      },

      lineHeight: {
        tight: '1.2',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },

      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
        wider: '0.05em',
      },

      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },

      // Spacing
      spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },

      // Border Radius
      borderRadius: {
        none: '0',
        xs: '0.25rem',
        sm: '0.5rem',
        base: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        full: '9999px',
      },

      // Shadows
      boxShadow: {
        xs: '0 1px 2px 0 rgba(28, 25, 23, 0.05)',
        sm: '0 1px 3px 0 rgba(28, 25, 23, 0.1), 0 1px 2px 0 rgba(28, 25, 23, 0.06)',
        base: '0 4px 6px -1px rgba(28, 25, 23, 0.1), 0 2px 4px -1px rgba(28, 25, 23, 0.06)',
        md: '0 10px 15px -3px rgba(28, 25, 23, 0.1), 0 4px 6px -2px rgba(28, 25, 23, 0.05)',
        lg: '0 20px 25px -5px rgba(28, 25, 23, 0.1), 0 10px 10px -5px rgba(28, 25, 23, 0.04)',
        xl: '0 25px 50px -12px rgba(28, 25, 23, 0.25)',
        '2xl': '0 25px 50px -12px rgba(28, 25, 23, 0.3)',
        'elevation-1': '0 2px 8px rgba(28, 25, 23, 0.08)',
        'elevation-2': '0 4px 16px rgba(28, 25, 23, 0.12)',
        'elevation-3': '0 8px 24px rgba(28, 25, 23, 0.15)',
        'elevation-4': '0 12px 32px rgba(28, 25, 23, 0.2)',
        'warm-sm': '0 2px 8px rgba(212, 114, 10, 0.08)',
        'warm-md': '0 4px 12px rgba(212, 114, 10, 0.12)',
        'warm-lg': '0 8px 16px rgba(212, 114, 10, 0.15)',
        inset: 'inset 0 2px 4px 0 rgba(28, 25, 23, 0.1)',
      },

      // Animations
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        slideLeft: 'slideLeft 0.3s ease-out',
        slideRight: 'slideRight 0.3s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        bounce: 'bounce 1s infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      // Transitions
      transitionDuration: {
        fast: '100ms',
        base: '150ms',
        slow: '200ms',
        slower: '300ms',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // Container
      maxWidth: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        max: '1400px',
      },
    },
  },

  plugins: [
  ],
};
