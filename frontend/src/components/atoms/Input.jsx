// src/components/atoms/Input.jsx (VERSIÓN EXTENDIDA - Compatible con perfil)
import PropTypes from 'prop-types';

export default function Input({ 
  type = 'text', 
  name,              // 👈 NUEVO: Para identificar el campo
  value = '',
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  autoComplete,
  error,             // 👈 NUEVO: Para mostrar mensajes de error
  className = '',
  ...props 
}) {
  const baseClasses = [
    'w-full px-4 py-3',
    'border-2 rounded-lg',
    'bg-gray-50',
    'focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white',
    'disabled:bg-gray-100 disabled:cursor-not-allowed',
    'transition-all duration-200',
    'text-gray-800 font-medium',
    'placeholder:text-gray-400',
    error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300', // 👈 NUEVO: Borde rojo si hay error
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      <input
        type={type}
        name={name}        // 👈 NUEVO
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={baseClasses}
        {...props}
      />
      {error && (
        // 👈 NUEVO: Mostrar mensaje de error si existe
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,    // 👈 NUEVO
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.string,
  error: PropTypes.string,   // 👈 NUEVO
  className: PropTypes.string,
};