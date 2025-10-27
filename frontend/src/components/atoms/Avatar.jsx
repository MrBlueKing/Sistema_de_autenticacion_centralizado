// src/components/atoms/Avatar.jsx
import PropTypes from 'prop-types';

export default function Avatar({ 
  icon: Icon,
  size = 'md',
  className = '' 
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
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

Avatar.propTypes = {
  icon: PropTypes.elementType,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};