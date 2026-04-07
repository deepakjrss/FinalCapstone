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

// ==================== ADVANCED COMPONENTS ====================

// Loading Skeleton Component
export const LoadingSkeleton = ({ variant = 'card', count = 3, className = '' }) => {
  if (variant === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'line') {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return null;
};

// Enhanced Empty State
export const EnhancedEmptyState = ({
  icon = '📭',
  title = 'No Data Available',
  description = 'There are no items to display',
  action = null,
  actionText = 'Get Started',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="text-7xl mb-4 animate-bounce">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action} className="mt-4">
          {actionText}
        </Button>
      )}
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ value = 0, max = 100, variant = 'default', showLabel = true, className = '' }) => {
  const percentage = (value / max) * 100;

  const variantClasses = {
    default: 'bg-gradient-to-r from-blue-400 to-blue-600',
    success: 'bg-gradient-to-r from-green-400 to-emerald-600',
    warning: 'bg-gradient-to-r from-amber-400 to-amber-600',
    accent: 'bg-gradient-to-r from-green-500 to-emerald-600'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-900">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Enhanced Stat Card
export const EnhancedStatCard = ({
  label,
  value,
  icon = null,
  trend = null,
  trendType = 'positive',
  bgVariant = 'default',
  className = ''
}) => {
  const bgClasses = {
    default: 'bg-gradient-to-br from-gray-50 to-gray-100',
    green: 'bg-gradient-to-br from-green-50 to-emerald-50',
    blue: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    amber: 'bg-gradient-to-br from-amber-50 to-orange-50'
  };

  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <Card className={`${bgClasses[bgVariant]} rounded-xl p-6 border border-gray-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className={`text-sm font-semibold mt-2 ${trendColors[trendType]}`}>{trend}</p>}
        </div>
        {icon && <div className="text-4xl opacity-40">{icon}</div>}
      </div>
    </Card>
  );
};

// Alert Component
export const Alert = ({
  children,
  variant = 'info',
  icon = null,
  closable = true,
  onClose = null,
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const config = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✅'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: '⚠️'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '❌'
    }
  };

  const cfg = config[variant] || config.info;

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className={`${cfg.bg} ${cfg.border} border rounded-lg p-4 flex gap-3 items-start ${className}`}>
      <div className="text-xl flex-shrink-0">{icon || cfg.icon}</div>
      <div className={`${cfg.text} flex-1 text-sm`}>{children}</div>
      {closable && (
        <button onClick={handleClose} className={`${cfg.text} hover:opacity-70 flex-shrink-0`}>
          ✕
        </button>
      )}
    </div>
  );
};

// Loading Button Component
export const LoadingButton = ({
  children,
  isLoading = false,
  disabled = false,
  loadingText = 'Loading...',
  variant = 'primary',
  className = '',
  ...props
}) => {
  return (
    <Button
      disabled={disabled || isLoading}
      variant={variant}
      className={className}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block animate-spin mr-2">⌛</span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
