// src/components/templates/AuthTemplate.jsx (VERSIÓN PROFESIONAL CON FONDO)
import PropTypes from 'prop-types';

export default function AuthTemplate({ 
  children,
  backgroundImage = '/images/mineria-background.jpg' // 👈 Tu imagen de fondo
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Imagen de Fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay oscuro con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-800/80 to-orange-900/60"></div>
        
        {/* Overlay con patrón industrial */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Efecto de viñeta */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
      </div>

      {/* Efectos decorativos flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculo superior derecho */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Círculo inferior izquierdo */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>

      {/* Marca de agua corporativa (opcional) */}
      <div className="absolute bottom-4 left-4 text-white/20 text-xs font-mono">
        M3H
      </div>
    </div>
  );
}

AuthTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundImage: PropTypes.string,
};