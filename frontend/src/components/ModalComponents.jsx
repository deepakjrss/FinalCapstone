import React, { useEffect } from 'react';
import { cn, designSystem } from '../theme/designSystem';

/**
 * Modal Component
 * Reusable modal/dialog with customizable content, size, and actions
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  showHeader = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  icon: Icon,
  className,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'bg-white rounded-2xl shadow-2xl transition-all duration-300 animate-slide-up',
          sizes[size],
          className
        )}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div className="flex items-start gap-3 flex-1">
              {Icon && <Icon className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />}
              <div>
                {title && (
                  <h2 className={cn(designSystem.typography.h3, 'text-gray-900')}>
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className={cn(designSystem.typography.small, 'text-gray-600 mt-1')}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4 flex-shrink-0"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex gap-3 justify-end p-6 border-t border-gray-100 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

/**
 * Confirmation Modal
 * Simple yes/no confirmation dialog
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}) => {
  const variantStyles = {
    default: {
      icon: '❓',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
    },
    danger: {
      icon: '⚠️',
      buttonClass: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: '⚠️',
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
    },
    success: {
      icon: '✓',
      buttonClass: 'bg-green-600 hover:bg-green-700',
    },
  };

  const style = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showHeader={false}
      closeOnBackdrop={false}
      closeOnEscape={!loading}
    >
      <div className="text-center py-4">
        <div className="text-5xl mb-4">{style.icon}</div>
        <p className={cn(designSystem.typography.h3, 'text-gray-900 mb-2')}>{title}</p>
        {message && (
          <p className={cn(designSystem.typography.body, 'text-gray-600')}>{message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-center mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className={cn(
            designSystem.shadows.md,
            'px-6 py-2 rounded-lg font-medium transition-all',
            'bg-gray-100 text-gray-700 hover:bg-gray-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            designSystem.shadows.md,
            style.buttonClass,
            'px-6 py-2 rounded-lg font-medium text-white transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loading ? '...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};

/**
 * Toast Notification Component
 */
export const Toast = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
  icon: Icon,
}) => {
  useEffect(() => {
    if (duration) {
      const timeout = setTimeout(onClose, duration);
      return () => clearTimeout(timeout);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border-2 animate-slide-up',
        style.bg,
        style.border
      )}
    >
      {Icon && <Icon className={cn('w-5 h-5 flex-shrink-0', style.icon)} />}
      <p className={cn(designSystem.typography.body, style.text, 'flex-1')}>{message}</p>
      <button
        onClick={onClose}
        className={cn(style.icon, 'hover:opacity-75 transition-opacity flex-shrink-0')}
      >
        ✕
      </button>
    </div>
  );
};

/**
 * Toast Container
 * Manages multiple toasts
 */
export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          icon={toast.icon}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * useToast Hook
 * Manage toasts from anywhere in the app
 */
export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };
};

/**
 * Dropdown/Menu Component
 */
export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  closeOnClick = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="transition-all duration-300"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 min-w-max bg-white rounded-lg shadow-xl z-20',
            'border border-gray-100 overflow-hidden animate-slide-up',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          onClick={closeOnClick ? () => setIsOpen(false) : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Dropdown Menu Item
 */
export const DropdownItem = ({
  onClick,
  children,
  icon: Icon,
  variant = 'default',
  danger = false,
}) => {
  const variantStyles = {
    default: 'hover:bg-gray-50 text-gray-900',
    active: 'bg-emerald-50 text-emerald-900',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
        danger ? 'text-red-600 hover:bg-red-50' : variantStyles[variant]
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className={designSystem.typography.body}>{children}</span>
    </button>
  );
};

/**
 * Hover Card Component
 */
export const HoverCard = ({
  trigger,
  children,
  position = 'top',
  width = 'w-64',
}) => {
  return (
    <div className="relative group inline-block">
      {trigger}
      <div
        className={cn(
          'absolute hidden group-hover:block bg-white border border-gray-100 rounded-lg shadow-xl z-20 p-4',
          width,
          position === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2',
          position === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2',
          position === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2',
          position === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2'
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default {
  Modal,
  ConfirmModal,
  Toast,
  ToastContainer,
  useToast,
  Dropdown,
  DropdownItem,
  HoverCard,
};
