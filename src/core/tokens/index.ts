export const designTokens = {
  // Colors
  colors: {
    primary: '#e68a1c',      // Gold
    secondary: '#d9714a',    // Copper
    success: '#5d9d5d',      // Sage
    warning: '#e68a1c',      // Gold
    error: '#c85d2f',        // Copper
    info: '#4c5f99',         // Indigo
    
    // Backgrounds
    bg: {
      light: '#fdfcfb',
      lighter: '#fffbf7',
      primary: '#faf8f6',
      secondary: '#f5f1ed',
      tertiary: '#ede6e0',
    },

    // Text
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
      tertiary: '#a8a29f',
      inverse: '#ffffff',
    },

    // Borders
    border: {
      light: '#e7e5e4',
      default: '#d6d3d1',
      dark: '#a8a29f',
    },
  },

  // Typography
  typography: {
    h1: {
      size: '48px',
      weight: 700,
      lineHeight: 1.2,
      family: 'Lora, serif',
    },
    h2: {
      size: '36px',
      weight: 700,
      lineHeight: 1.3,
      family: 'Lora, serif',
    },
    h3: {
      size: '30px',
      weight: 600,
      lineHeight: 1.3,
      family: 'Lora, serif',
    },
    body: {
      size: '16px',
      weight: 400,
      lineHeight: 1.6,
      family: 'Inter, sans-serif',
    },
    caption: {
      size: '12px',
      weight: 500,
      lineHeight: 1.4,
      family: 'Inter, sans-serif',
    },
  },

  // Spacing
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 3px 0 rgba(28, 25, 23, 0.1)',
    md: '0 10px 15px -3px rgba(28, 25, 23, 0.1)',
    lg: '0 20px 25px -5px rgba(28, 25, 23, 0.1)',
  },

  // Border Radius
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  // Z-index
  zIndex: {
    base: 0,
    dropdown: 1000,
    modal: 1050,
    tooltip: 1070,
  },

  // Transitions
  transitions: {
    fast: '100ms',
    base: '150ms',
    slow: '300ms',
  },
};

export type DesignTokens = typeof designTokens;
