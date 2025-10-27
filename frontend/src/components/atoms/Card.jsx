// src/components/atoms/Card.jsx
import PropTypes from 'prop-types';

export default function Card({ 
  children, 
  onClick,
  hoverable = false,
  className = '' 
}) {
  const hoverClasses = hoverable 
    ? 'hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all' 
    : '';

  const baseClasses = [
    'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
    hoverClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      onClick={onClick}
      className={baseClasses}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};