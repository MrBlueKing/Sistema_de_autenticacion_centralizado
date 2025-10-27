// src/components/templates/LoadingTemplate.jsx
import PropTypes from 'prop-types';

export default function LoadingTemplate({ 
  message = 'Cargando...',
  className = ''
}) {
  const baseClasses = [
    'min-h-screen bg-gray-50 flex items-center justify-center',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={baseClasses}>
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        
        {/* Message */}
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
}

LoadingTemplate.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};