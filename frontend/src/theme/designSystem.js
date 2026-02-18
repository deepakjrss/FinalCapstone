// Global Design System and Theme Constants
export const designSystem = {
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    emerald: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    teal: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    danger: {
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  gradients: {
    primary: 'from-emerald-600 to-teal-600',
    primaryLight: 'from-emerald-100 to-teal-100',
    background: 'from-slate-50 via-emerald-50 to-teal-50',
    card: 'from-white/40 to-white/30',
  },

  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 'bold',
      lineHeight: '1.2',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold',
      lineHeight: '1.3',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      lineHeight: '1.4',
    },
    body: {
      fontSize: '1rem',
      lineHeight: '1.6',
    },
    small: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
  },
};

export const ecoTheme = {
  // Eco-friendly color meanings
  badges: {
    eco: '🌱', // Eco Starter
    tree: '🌳', // Tree Protector
    earth: '🌍', // Climate Champion
    trophy: '🏆', // Quiz Master
    forest: '🌲', // Forest Guardian
    star: '⭐', // Game Legend
  },

  // Status colors
  status: {
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    info: '#3b82f6', // Blue
  },

  // Common breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export const pageStyles = {
  // Common page layout styles
  pageContainer: 'min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex',
  pageMain: 'ml-64 flex-1 overflow-auto',
  contentWrapper: 'p-8 max-w-7xl mx-auto',

  // Card styles
  cardBase: 'bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl',
  cardHover: 'hover:shadow-2xl hover:scale-105 transition-all duration-300 transform',
  cardPrimary: 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white',

  // Interactive elements
  buttonPrimary: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300',
  buttonSecondary: 'bg-white/40 backdrop-blur-xl border border-white/60 text-gray-800 hover:bg-white/50',

  // Text styles
  heading1: 'text-5xl font-bold text-gray-800',
  heading2: 'text-2xl font-bold text-gray-800',
  heading3: 'text-xl font-semibold text-gray-800',
  bodyText: 'text-gray-700 leading-relaxed',
  smallText: 'text-xs text-gray-600',

  // Spacing presets
  spacingMd: 'p-6 space-y-4',
  spacingLg: 'p-8 space-y-6',
};

// Utility function to combine class names
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
