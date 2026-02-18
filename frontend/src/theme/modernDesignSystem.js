/**
 * Modern SaaS Design System for EcoVerse
 * Professional color scheme, spacing, typography, and component patterns
 */

export const modernDesignSystem = {
  // Color Palette - Professional SaaS Style
  colors: {
    // Primary - Eco Green
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a', // Primary Green
      700: '#15803d',
      800: '#166534',
      900: '#145231',
    },
    // Secondary - Emerald/Teal
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    // Neutrals
    gray: {
      50: '#f9fafb',  // Background
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Status Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Spacing System (4px base)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
    '4xl': '4rem',    // 64px
  },

  // Typography
  typography: {
    h1: {
      size: '2.25rem',    // 36px
      weight: 700,
      lineHeight: 1.2,
    },
    h2: {
      size: '1.875rem',   // 30px
      weight: 700,
      lineHeight: 1.3,
    },
    h3: {
      size: '1.5rem',     // 24px
      weight: 600,
      lineHeight: 1.4,
    },
    body: {
      size: '1rem',       // 16px
      weight: 400,
      lineHeight: 1.5,
    },
    small: {
      size: '0.875rem',   // 14px
      weight: 400,
      lineHeight: 1.5,
    },
    label: {
      size: '0.75rem',    // 12px
      weight: 500,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },

  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Transitions
  transitions: {
    fast: 'all 0.15s ease-in-out',
    base: 'all 0.3s ease-in-out',
    slow: 'all 0.5s ease-in-out',
  },

  // Component Patterns
  components: {
    card: {
      base: 'bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300',
      interactive: 'cursor-pointer',
      padding: 'p-6',
    },
    button: {
      base: 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300',
      primary: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg hover:scale-105',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
      ghost: 'text-gray-700 hover:bg-gray-100',
    },
    input: {
      base: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300',
    },
  },
};

// TailwindCSS class generators
export const generateClasses = {
  card: () => 'bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 p-6',
  button: {
    primary: () => 'inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg',
    secondary: () => 'inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg border border-gray-300 transition-all duration-300',
    outline: () => 'inline-flex items-center justify-center px-4 py-2 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition-all duration-300',
  },
  statCard: () => 'bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300',
  badge: () => 'inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium',
};

// Layout constants
export const layoutConstants = {
  sidebarWidth: '16rem',      // 256px
  topNavHeight: '4rem',        // 64px
  maxContentWidth: '1280px',   // xl
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default modernDesignSystem;
