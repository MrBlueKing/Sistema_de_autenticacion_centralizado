// src/components/atoms/Logo.jsx
import PropTypes from 'prop-types';

export default function Logo({ 
  icon: Icon, 
  size = 'md',
  className = '' 
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const baseClasses = [
    'bg-indigo-600 rounded-lg',
    'flex items-center justify-center',
    sizes[size],
    className
  ].filter(Boolean).join(' ');

  const iconClasses = ['text-white', iconSizes[size]].join(' ');

  return (
    <div className={baseClasses}>
      {Icon && <Icon className={iconClasses} />}
    </div>
  );
}

Logo.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};