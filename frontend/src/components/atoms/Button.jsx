// src/components/atoms/Button.jsx (VERSIÓN MEJORADA)
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
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  const baseClasses = [
    'px-6 py-3 rounded-lg font-semibold',
    'transition-all duration-300',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'transform hover:-translate-y-0.5',
    'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2',
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