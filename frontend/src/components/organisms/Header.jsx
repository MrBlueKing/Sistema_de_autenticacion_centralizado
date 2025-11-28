import { useState, useRef, useEffect } from 'react';
import { HiArrowRightOnRectangle, HiChevronDown, HiUser } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    const nombre = user?.nombre || '';
    const apellido = user?.apellido || '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y Título */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Logo Empresa"
              className="h-20 w-auto object-contain bg-transparent rounded-lg p-1.5 shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Sistema de Producción y Gestión Minera Integrada
              </h1>
            </div>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-lg transition-all border border-white/20 hover:border-white/40"
            >
              {/* Avatar */}
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold text-sm shadow-md">
                {getUserInitials()}
              </div>

              {/* User Info */}
              <div className="text-left hidden sm:block">
                <p className="text-white font-semibold text-sm leading-tight">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-orange-100 text-xs">
                  {user?.rol || 'Usuario'}
                </p>
              </div>

              {/* Chevron */}
              <HiChevronDown
                className={`w-4 h-4 text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 ${dropdownOpen ? 'animate-fadeIn' : 'animate-fadeOut'
                }`}>
                {/* User Info en el dropdown */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 border-b border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {user?.nombre} {user?.apellido}
                      </p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                      {user?.faena && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: user.faena.color }}
                          ></div>
                          <p className="text-xs text-gray-700 font-medium">
                            {user.faena.ubicacion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <a
                    href="http://localhost:5173/profile"
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen(false);
                      window.location.href = 'http://localhost:5173/profile';
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors block"
                  >
                    <HiUser className="w-5 h-5" />
                    <span className="font-medium">Mi Perfil</span>
                  </a>
                  {location.pathname.startsWith('/admin') && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">Volver al Dashboard</span>
                    </button>
                  )}
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors font-medium"
                  >
                    <HiArrowRightOnRectangle className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
