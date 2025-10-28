// src/components/organisms/LoginCard.jsx (VERSIÓN PROFESIONAL)
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';

export default function LoginCard({ 
  rut,
  setRut,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  logoUrl = 'logo.png', // 👈 Ruta de tu logo
  companyName = 'M3HCooper', // 👈 Nombre de tu empresa
  className = ''
}) {
  return (
    <div className={`max-w-md w-full ${className}`}>
      {/* Header Profesional */}
      <div className="text-center mb-8">
        {/* Logo Empresarial */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Círculo decorativo detrás del logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-xl opacity-20 scale-110"></div>
            
            {/* Logo */}
            <div className="relative bg-transparent rounded-4xl shadow-xl p-4 border-6 border-orange-400/20">
              <img 
                src={logoUrl} 
                alt={`Logo ${companyName}`}
                className="w-30 h-30 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Título Principal - ELIGE UNO */}
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          Sistema Integrado de Gestión Minera
        </h1>
        
        {/* Línea decorativa */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-400"></div>
          <div className="h-1 w-8 bg-orange-500 rounded-full"></div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-400"></div>
        </div>
      
      </div>

      {/* Card Content */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <LoginForm
          rut={rut}
          setRut={setRut}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={onSubmit}
        />
      </div>

      {/* Footer Profesional */}
      <div className="text-center mt-6 space-y-2">
        <p className="text-white/80 text-sm font-medium drop-shadow">
          {companyName}
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-white/60">
          <span></span>
          <span>v2.0</span>
        </div>
      </div>
    </div>
  );
}

LoginCard.propTypes = {
  rut: PropTypes.string.isRequired,
  setRut: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  logoUrl: PropTypes.string,
  companyName: PropTypes.string,
  className: PropTypes.string,
};