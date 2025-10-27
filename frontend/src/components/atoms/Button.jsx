// src/components/atoms/Button.jsx
import PropTypes from 'prop-types';

export default function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', 
  disabled = false,
  fullWidth = false,
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  const baseClasses = [
    'px-4 py-2 rounded-lg font-medium',
    'transition-colors duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};