// src/components/atoms/ErrorAlert.jsx
import PropTypes from 'prop-types';

export default function ErrorAlert({ message, className = '' }) {
  if (!message) return null;

  return (
    <div 
      className={`
        bg-red-50 border border-red-200 text-red-700 
        px-4 py-3 rounded-lg text-sm
        ${className}
      `}
      role="alert"
    >
      {message}
    </div>
  );
}

ErrorAlert.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};