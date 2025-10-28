// src/components/atoms/ErrorAlert.jsx (VERSIÓN MEJORADA)
import PropTypes from 'prop-types';
import { HiExclamationTriangle } from 'react-icons/hi2';

export default function ErrorAlert({ message, className = '' }) {
  if (!message) return null;

  return (
    <div 
      className={`
        bg-red-50 border-l-4 border-red-500 text-red-700 
        px-4 py-3 rounded-lg text-sm flex items-start gap-3
        shadow-sm
        ${className}
      `}
      role="alert"
    >
      <HiExclamationTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}

ErrorAlert.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};