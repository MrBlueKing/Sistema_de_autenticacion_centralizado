// src/components/atoms/Logo.jsx (VERSIÓN MEJORADA)
import PropTypes from 'prop-types';

export default function Logo({ 
  icon: Icon, 
  size = 'md',
  className = '' 
}) {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  const baseClasses = [
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'rounded-2xl shadow-lg',
    'flex items-center justify-center',
    'transform transition-transform hover:scale-105',
    'border-2 border-orange-400',
    sizes[size],
    className
  ].filter(Boolean).join(' ');

  const iconClasses = ['text-white drop-shadow-md', iconSizes[size]].join(' ');

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