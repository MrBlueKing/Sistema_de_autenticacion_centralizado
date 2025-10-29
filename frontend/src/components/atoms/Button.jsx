// src/components/atoms/Button.jsx (VERSIÓN EXTENDIDA - Compatible con perfil)
import PropTypes from 'prop-types';

export default function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', 
  disabled = false,
  loading = false,      // 👈 NUEVO: Para mostrar spinner
  fullWidth = false,
  icon: Icon,           // 👈 NUEVO: Para agregar iconos
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50', // 👈 NUEVO: Para variante outline
  };

  const baseClasses = [
    'px-6 py-3 rounded-lg font-semibold',
    'transition-all duration-300',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'transform hover:-translate-y-0.5',
    'focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2',
    'flex items-center justify-center gap-2', // 👈 NUEVO: Para iconos y loading
    variants[variant],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}  // 👈 MODIFICADO: También deshabilitar cuando está loading
      className={baseClasses}
      {...props}
    >
      {loading ? (
        // 👈 NUEVO: Mostrar spinner cuando loading=true
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Procesando...</span>
        </>
      ) : (
        // 👈 NUEVO: Mostrar icono si se proporciona
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline']), // 👈 MODIFICADO: Agregado outline
  disabled: PropTypes.bool,
  loading: PropTypes.bool,    // 👈 NUEVO
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType, // 👈 NUEVO
  className: PropTypes.string,
};