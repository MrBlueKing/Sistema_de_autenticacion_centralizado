// src/components/atoms/Input.jsx (VERSIÓN MEJORADA)
import PropTypes from 'prop-types';

export default function Input({ 
  type = 'text', 
  value = '',
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  ...props 
}) {
  const baseClasses = [
    'w-full px-4 py-3',
    'border-2 border-gray-300 rounded-lg',
    'bg-gray-50',
    'focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white',
    'disabled:bg-gray-100 disabled:cursor-not-allowed',
    'transition-all duration-200',
    'text-gray-800 font-medium',
    'placeholder:text-gray-400',
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      className={baseClasses}
      {...props}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
};