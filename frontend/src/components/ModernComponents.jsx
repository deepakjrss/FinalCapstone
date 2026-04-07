/**
 * Modern SaaS Components for EcoVerse
 * Reusable, professional-grade components following modern design system
 */

import React from 'react';
import { motion } from 'framer-motion';

// ==================== MODERN CARD ====================
export const ModernCard = ({
  children,
  className = '',
  interactive = false,
  onClick,
  shadow = 'md',
  ...props
}) => {
  const baseClasses = `
    bg-white dark:bg-gray-800 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700
    ${shadow === 'md' && 'shadow-md hover:shadow-lg'}
    ${shadow === 'lg' && 'shadow-lg hover:shadow-xl'}
    p-6
    ${interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
  `.trim();

  return (
    <div
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// ==================== MODERN STAT CARD ====================
export const ModernStatCard = ({
  icon,
  label,
  value,
  change,
  changeType = 'positive', // positive, negative, neutral
  trend = null,
  ...props
}) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-600';

  return (
    <ModernCard shadow="md" {...props}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
          {(change || trend) && (
            <p className={`text-sm mt-2 ${changeColor}`}>
              {change && <>{change} {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''}</>}
              {trend && <> {trend}</>}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-5xl opacity-20 ml-4 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </ModernCard>
  );
};

// ==================== MODERN BUTTON ====================
export const ModernButton = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 active:scale-95';

  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 dark:hover:bg-green-800 text-white shadow-md hover:shadow-lg disabled:bg-gray-400 dark:disabled:bg-gray-600',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-700',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 disabled:border-gray-300 disabled:text-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 text-white shadow-md hover:shadow-lg disabled:bg-gray-400 dark:disabled:bg-gray-600',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:text-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm gap-2',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
  };

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `.trim()}
      disabled={disabled || loading}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
};

// ==================== MODERN SECTION ====================
export const ModernSection = ({
  title,
  subtitle,
  children,
  headerAction,
  className = '',
  ...props
}) => {
  return (
    <section className={`space-y-4 ${className}`} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>}
            {subtitle && <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};

// ==================== MODERN GRID ====================
export const ModernGrid = ({
  children,
  columns = 3,
  gap = 6,
  responsive = true,
  ...props
}) => {
  const gapClass = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  }[gap] || 'gap-6';

  const colClass = responsive
    ? {
      1: 'grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4',
    }[columns]
    : {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    }[columns];

  return (
    <div className={`grid grid-cols-1 ${colClass} ${gapClass}`} {...props}>
      {children}
    </div>
  );
};

// ==================== MODERN INPUT ====================
export const ModernInput = ({
  label,
  placeholder,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}
          `.trim()}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
};

// ==================== MODERN SELECT ====================
export const ModernSelect = ({
  label,
  options = [],
  error,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}
        `.trim()}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
    </div>
  );
};

// ==================== MODERN BADGE ====================
export const ModernBadge = ({
  children,
  variant = 'default', // default, success, warning, info, danger
  icon,
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400',
    info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400',
    danger: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400',
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`} {...props}>
      {icon}
      {children}
    </span>
  );
};

// ==================== MODERN CONTAINER ====================
export const ModernContainer = ({
  children,
  className = '',
  maxWidth = 'max-w-7xl',
  ...props
}) => {
  return (
    <div className={`mx-auto ${maxWidth} px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

// ==================== MODERN DIVIDER ====================
export const ModernDivider = ({ className = '' }) => {
  return <hr className={`border-t border-gray-200 dark:border-gray-700 ${className}`} />;
};

// ==================== MODERN SKELETON ====================
export const ModernSkeleton = ({ count = 1, height = 'h-10' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gray-200 rounded-lg animate-pulse`}
        />
      ))}
    </>
  );
};

const modernComponents = {
  ModernCard,
  ModernStatCard,
  ModernButton,
  ModernSection,
  ModernGrid,
  ModernInput,
  ModernSelect,
  ModernBadge,
  ModernContainer,
  ModernDivider,
  ModernSkeleton,
};

export default modernComponents;
