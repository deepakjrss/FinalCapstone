// Reusable Button Component
import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-white/40 backdrop-blur-xl border border-white/60 text-gray-800 hover:bg-white/50 hover:shadow-lg',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:scale-105',
    ghost: 'text-emerald-600 hover:bg-emerald-50 rounded-lg',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Reusable Card Component
export const Card = ({ children, className = '', clickable = false }) => {
  return (
    <div
      className={`bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg ${
        clickable ? 'hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Reusable Container Component
export const Container = ({ children, className = '' }) => {
  return (
    <div className={`p-8 max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
};

// Page Header Component
export const PageHeader = ({ title, subtitle, icon = '' }) => {
  return (
    <div className="mb-12">
      <h1 className="text-5xl font-bold text-gray-800 mb-3 flex items-center gap-3">
        <span>{icon}</span>
        {title}
      </h1>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
};

// Stats Card Component
export const StatsCard = ({ label, value, icon = '', color = 'emerald' }) => {
  const colors = {
    emerald: 'text-emerald-600',
    teal: 'text-teal-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
  };

  return (
    <Card className="p-6 text-center">
      <p className={`text-4xl font-bold mb-2 ${colors[color]}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {value}
      </p>
      <p className="text-gray-700 font-semibold">{label}</p>
    </Card>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ icon, title, message, action = null }) => {
  return (
    <Card className="p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      {action}
    </Card>
  );
};

// Error Alert Component
export const ErrorAlert = ({ message, onRetry = null }) => {
  return (
    <Card className="bg-red-50/40 border-red-200/60 p-8 text-center">
      <p className="text-red-700 font-semibold text-lg">❌ Error</p>
      <p className="text-red-600 mt-2">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </Card>
  );
};

// Badge Component (for displaying tags/badges)
export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const variants = {
    primary: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    secondary: 'bg-teal-100 text-teal-800 border border-teal-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// Section Component
export const Section = ({ title, subtitle = '', children, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

// Grid Component
export const Grid = ({ children, cols = 3, className = '' }) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${colClasses[cols]} ${className}`}>
      {children}
    </div>
  );
};
