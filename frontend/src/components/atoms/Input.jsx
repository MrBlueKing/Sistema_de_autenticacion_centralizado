// src/components/atoms/Input.jsx
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
    'w-full px-3 py-2',
    'border border-gray-300 rounded-lg',
    'focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
    'disabled:bg-gray-100 disabled:cursor-not-allowed',
    'transition-colors',
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