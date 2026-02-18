import React, { useState } from 'react';
import { designSystem, cn, ecoTheme } from '../theme/designSystem';

/**
 * Form Input Component
 * Reusable text/email/password input field with validation and help text
 */
export const FormInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helpText,
  required = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(designSystem.typography.body, 'font-medium text-gray-700')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2 border-2 rounded-lg transition-all duration-300',
            Icon ? 'pl-10' : '',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
          )}
          {...props}
        />
      </div>
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      {helpText && !error && <p className="text-gray-500 text-sm">{helpText}</p>}
    </div>
  );
};

/**
 * Form Textarea Component
 * Reusable multi-line text input with auto-resize capability
 */
export const FormTextarea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  helpText,
  required = false,
  disabled = false,
  rows = 4,
  ...props
}) => {
  const [height, setHeight] = useState(`${rows * 2.5}rem`);

  const handleChange = (e) => {
    onChange(e);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 300) + 'px';
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(designSystem.typography.body, 'font-medium text-gray-700')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        rows={rows}
        className={cn(
          'w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 resize-none',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
        )}
        {...props}
      />
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      {helpText && !error && <p className="text-gray-500 text-sm">{helpText}</p>}
    </div>
  );
};

/**
 * Form Select Component
 * Reusable dropdown select input
 */
export const FormSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  helpText,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(designSystem.typography.body, 'font-medium text-gray-700')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 appearance-none cursor-pointer',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      {helpText && !error && <p className="text-gray-500 text-sm">{helpText}</p>}
    </div>
  );
};

/**
 * Form Checkbox Component
 */
export const FormCheckbox = ({
  label,
  checked,
  onChange,
  error,
  disabled = false,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-5 h-5 rounded border-2 cursor-pointer transition-all duration-300',
            error
              ? 'border-red-500'
              : 'border-gray-300 checked:bg-emerald-600 checked:border-emerald-600',
            disabled && 'opacity-60 cursor-not-allowed'
          )}
          {...props}
        />
        {label && (
          <label className={cn(designSystem.typography.body, 'font-medium text-gray-700 ml-3')}>
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
    </div>
  );
};

/**
 * Form Radio Group Component
 */
export const FormRadio = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  disabled = false,
  direction = 'vertical',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(designSystem.typography.body, 'font-medium text-gray-700')}>
          {label}
        </label>
      )}
      <div className={cn('space-y-2', direction === 'horizontal' && 'flex gap-4')}>
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${opt.value}`}
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              disabled={disabled}
              className={cn(
                'w-5 h-5 cursor-pointer transition-all duration-300',
                error ? 'border-red-500' : 'border-gray-300',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
              {...props}
            />
            <label
              htmlFor={`${name}-${opt.value}`}
              className={cn(
                designSystem.typography.body,
                'font-medium text-gray-700 ml-3 cursor-pointer'
              )}
            >
              {opt.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
    </div>
  );
};

/**
 * Form Group Component
 * Wraps multiple form fields for consistent spacing
 */
export const FormGroup = ({ children, className }) => {
  return <div className={cn('space-y-4', className)}>{children}</div>;
};

/**
 * Form Component
 * Main form wrapper with submit handling
 */
export const Form = ({ onSubmit, children, className, loading = false }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn('space-y-6', className)}
    >
      {children}
    </form>
  );
};

/**
 * Alert Component
 * Displays various types of alerts/notifications
 */
export const Alert = ({ variant = 'info', title, message, icon: Icon, onClose, action }) => {
  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      title: 'text-green-900',
      message: 'text-green-800',
      icon: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      title: 'text-red-900',
      message: 'text-red-800',
      icon: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
      icon: 'text-yellow-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      title: 'text-blue-900',
      message: 'text-blue-800',
      icon: 'text-blue-600',
    },
  };

  const style = variants[variant];

  return (
    <div className={cn('p-4 rounded-lg border-2 flex gap-4 items-start', style.bg, style.border)}>
      {Icon && <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', style.icon)} />}
      <div className="flex-1">
        {title && <p className={cn('font-semibold', style.title)}>{title}</p>}
        {message && <p className={cn('text-sm mt-1', style.message)}>{message}</p>}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        {action && action}
        {onClose && (
          <button
            onClick={onClose}
            className={cn('text-gray-400 hover:text-gray-600 transition-colors')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Progress Bar Component
 */
export const ProgressBar = ({ value, max = 100, label, showPercentage = true, variant = 'default' }) => {
  const percentage = (value / max) * 100;

  const variantStyles = {
    default: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <p className={designSystem.typography.small}>{label}</p>
          {showPercentage && (
            <p className={cn(designSystem.typography.small, 'font-semibold text-emerald-600')}>
              {Math.round(percentage)}%
            </p>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(variantStyles[variant], 'h-full rounded-full transition-all duration-500')}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Badge Component
 * Tag/label display with various styles
 */
export const BadgeComponent = ({ children, variant = 'default', size = 'md', icon: Icon }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-emerald-100 text-emerald-800',
    secondary: 'bg-teal-100 text-teal-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full font-medium', variants[variant], sizes[size])}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
};

/**
 * Tooltip Component
 */
export const Tooltip = ({ children, content, position = 'top' }) => {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={cn(
          'absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 transition-all',
          positions[position]
        )}
      >
        {content}
        <div
          className={cn(
            'absolute w-2 h-2 bg-gray-900',
            position === 'top' && 'top-full left-1/2 -translate-x-1/2 -translate-y-1',
            position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 translate-y-1',
            position === 'left' && 'left-full top-1/2 -translate-y-1/2 translate-x-1',
            position === 'right' && 'right-full top-1/2 -translate-y-1/2 -translate-x-1'
          )}
          style={{
            clipPath:
              position === 'top'
                ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                : position === 'bottom'
                ? 'polygon(0% 0%, 100% 0%, 50% 100%)'
                : position === 'left'
                ? 'polygon(100% 0%, 100% 100%, 0% 50%)'
                : 'polygon(0% 0%, 0% 100%, 100% 50%)',
          }}
        />
      </div>
    </div>
  );
};

export default {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormGroup,
  Form,
  Alert,
  ProgressBar,
  BadgeComponent,
  Tooltip,
};
