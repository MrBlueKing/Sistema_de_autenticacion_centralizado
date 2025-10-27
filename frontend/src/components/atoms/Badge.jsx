// src/components/atoms/Badge.jsx
import PropTypes from 'prop-types';

export default function Badge({ 
  children, 
  variant = 'primary',
  className = '' 
}) {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
    gray: 'bg-gray-50 text-gray-700',
  };

  return (
    <span 
      className={`
        px-2 py-1 rounded text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'gray']),
  className: PropTypes.string,
};