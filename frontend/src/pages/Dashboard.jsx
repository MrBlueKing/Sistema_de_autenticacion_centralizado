// Dashboard.jsx - VERSIÓN PROFESIONAL MEJORADA CON COLORES DINÁMICOS
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiArrowRightOnRectangle,
    HiUser,
    HiShieldCheck,
    HiCube,
    HiUsers,
    HiChartBar,
    HiArrowTopRightOnSquare,
    HiChevronDown,
    HiEnvelope,
    HiIdentification,
    HiMapPin,
    HiCheckCircle,
    HiSparkles
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth';
import adminService from '../services/adminService';
import Header from '../components/organisms/Header';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadModulos();
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const response = await adminService.dashboard.checkAdmin();
            setIsAdmin(response.data.is_admin);
        } catch (error) {
            setIsAdmin(false);
        }
    };

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadModulos = async () => {
        const modulosData = await authService.getModulos();
        console.log("Modulos:", modulosData);
        setModulos(modulosData);
        setLoading(false);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleModuleClick = (modulo) => {
        const token = authService.getToken();
        const url = `${modulo.url}?token=${token}&modulo_id=${modulo.id}`;
        console.log('🔗 Abriendo módulo:', url);
        window.open(url, '_blank');
    };

    // Función para ajustar el brillo de un color
    const adjustColorBrightness = (color, percent) => {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    };

    // Obtener color de la faena o usar naranja por defecto
    const faenaColor = user?.faena?.color || '#f97316';
    const faenaColorLight = adjustColorBrightness(faenaColor, 40);
    const faenaColorDark = adjustColorBrightness(faenaColor, -20);

    // Loading State Mejorado
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Cargando módulos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
            <Header />
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Banner - Dinámico con color de faena */}
                <div
                    className="rounded-3xl shadow-2xl p-10 mb-8 text-white relative overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
                    style={{
                        background: `linear-gradient(135deg, ${faenaColor} 0%, ${faenaColorDark} 100%)`
                    }}
                >
                    {/* Patrón decorativo animado */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-2xl"></div>
                    </div>

                    {/* Efectos decorativos */}
                    <div className="absolute top-6 right-6 opacity-20">
                        <HiSparkles className="w-24 h-24" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex-1">
                                <h2 className="text-4xl font-bold mb-3 drop-shadow-lg flex items-center gap-3">
                                    ¡Bienvenido, {user?.nombre}!
                                    <span className="text-5xl animate-wave inline-block" style={{ animationDelay: '0.3s' }}>👋</span>
                                </h2>
                                <p className="text-white/90 text-lg mb-4 font-medium">
                                    Accede a tus módulos y gestiona tu trabajo de forma eficiente
                                </p>

                                {/* Badge de Faena */}
                                {user?.faena && (
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30 shadow-lg">
                                        <HiMapPin className="w-5 h-5" />
                                        <span className="font-semibold text-lg">
                                            Faena {user.faena.ubicacion}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Stats rápidas */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20 shadow-xl">
                                <div className="text-center">
                                    <p className="text-white/80 text-sm mb-1 font-medium">Módulos disponibles</p>
                                    <p className="text-5xl font-bold drop-shadow-lg">
                                        {modulos.filter(m => !(isAdmin && m.nombre === 'Administrador')).length + (isAdmin ? 1 : 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Línea decorativa inferior */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                </div>

                {/* User Details Card - Rediseñada */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div
                            className="p-2 rounded-xl"
                            style={{ backgroundColor: `${faenaColor}20` }}
                        >
                            <HiUser className="w-6 h-6" style={{ color: faenaColor }} />
                        </div>
                        Información del Usuario
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* RUT */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <HiIdentification className="w-5 h-5 text-gray-600" />
                                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">RUT</p>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">{user?.rut}</p>
                        </div>

                        {/* Email */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <HiEnvelope className="w-5 h-5 text-blue-600" />
                                <p className="text-xs text-blue-700 uppercase tracking-wide font-semibold">Email</p>
                            </div>
                            <p className="font-bold text-gray-900 text-lg truncate">{user?.email}</p>
                        </div>

                        {/* Faena */}
                        <div
                            className="rounded-xl p-5 border-2 hover:shadow-md transition-all"
                            style={{
                                background: `linear-gradient(135deg, ${faenaColor}10 0%, ${faenaColor}20 100%)`,
                                borderColor: `${faenaColor}40`
                            }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <HiMapPin className="w-5 h-5" style={{ color: faenaColor }} />
                                <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: faenaColorDark }}>Faena</p>
                            </div>
                            {user?.faena ? (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-md ring-2 ring-white"
                                        style={{ backgroundColor: user.faena.color }}
                                    ></div>
                                    <p className="font-bold text-gray-900 text-lg">
                                        {user.faena.ubicacion}
                                    </p>
                                </div>
                            ) : (
                                <p className="font-semibold text-gray-400">No asignada</p>
                            )}
                        </div>

                        {/* Estado */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <HiCheckCircle className="w-5 h-5 text-green-600" />
                                <p className="text-xs text-green-700 uppercase tracking-wide font-semibold">Estado</p>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                Activo
                            </div>
                        </div>
                    </div>
                </div>

                {/* Módulos Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Tus Módulos
                            </h2>
                            <p className="text-gray-600">Selecciona un módulo para comenzar a trabajar</p>
                        </div>
                        <div
                            className="px-5 py-3 rounded-xl text-white font-bold shadow-lg"
                            style={{ backgroundColor: faenaColor }}
                        >
                            {(() => {
                                const count = modulos.filter(m => !(isAdmin && m.nombre === 'Administrador')).length + (isAdmin ? 1 : 0);
                                return `${count} módulo${count !== 1 ? 's' : ''}`;
                            })()}
                        </div>
                    </div>

                    {modulos.length === 0 && !isAdmin ? (
                        // Empty State
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-12 text-center">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HiCube className="w-10 h-10 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                                No tienes módulos asignados
                            </h3>
                            <p className="text-yellow-700">
                                Contacta al administrador para obtener acceso a los módulos del sistema
                            </p>
                        </div>
                    ) : (
                        // Módulos Grid - Mejorado
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Card de Administración - Solo visible para admins */}
                            {isAdmin && (
                                <div
                                    onClick={() => navigate('/admin')}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-transparent p-7 group transform hover:-translate-y-2 relative overflow-hidden"
                                    style={{
                                        animation: 'fadeInUp 0.5s ease-out 0s both'
                                    }}
                                >
                                    {/* Borde superior con color de faena */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1.5 group-hover:h-2 transition-all"
                                        style={{ backgroundColor: faenaColor }}
                                    ></div>

                                    {/* Efecto de brillo en hover */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                        style={{ background: `linear-gradient(135deg, ${faenaColor} 0%, transparent 100%)` }}
                                    ></div>

                                    {/* Module Header */}
                                    <div className="relative z-10">
                                        <div className="flex items-start gap-4 mb-5">
                                            <div className="text-6xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                                                🛡️
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className="font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-transparent bg-clip-text transition-all"
                                                    style={{
                                                        backgroundImage: `linear-gradient(135deg, ${faenaColor}, ${faenaColorDark})`
                                                    }}
                                                >
                                                    Panel de Administración
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                    Gestiona usuarios, roles, permisos y módulos del sistema
                                                </p>
                                            </div>
                                        </div>

                                        {/* Roles/Badges */}
                                        <div className="mb-5">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold flex items-center gap-2">
                                                <HiShieldCheck className="w-4 h-4" />
                                                Acceso administrativo:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span
                                                    className="px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm border-2 transition-all group-hover:scale-105"
                                                    style={{
                                                        backgroundColor: `${faenaColor}15`,
                                                        color: faenaColorDark,
                                                        borderColor: `${faenaColor}30`
                                                    }}
                                                >
                                                    Administrador
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="mt-5 pt-5 border-t-2 border-gray-100">
                                            <div
                                                className="flex items-center justify-center gap-2 font-bold group-hover:gap-3 transition-all py-3 px-4 rounded-xl"
                                                style={{
                                                    color: faenaColor,
                                                    backgroundColor: `${faenaColor}10`
                                                }}
                                            >
                                                <span>Acceder al módulo</span>
                                                <HiArrowTopRightOnSquare className="w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Módulos regulares */}
                            {modulos
                                .filter(modulo => {
                                    // Filtrar el módulo "Administrador" si el usuario ya tiene la card de admin
                                    if (isAdmin && modulo.nombre === 'Administrador') {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((modulo, index) => (
                                <div
                                    key={modulo.id}
                                    onClick={() => handleModuleClick(modulo)}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-transparent p-7 group transform hover:-translate-y-2 relative overflow-hidden"
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Borde superior con color de faena */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1.5 group-hover:h-2 transition-all"
                                        style={{ backgroundColor: faenaColor }}
                                    ></div>

                                    {/* Efecto de brillo en hover */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                        style={{ background: `linear-gradient(135deg, ${faenaColor} 0%, transparent 100%)` }}
                                    ></div>

                                    {/* Module Header */}
                                    <div className="relative z-10">
                                        <div className="flex items-start gap-4 mb-5">
                                            <div className="text-6xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                                                {modulo.icono || '📦'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className="font-bold text-xl text-gray-900 mb-2 truncate group-hover:text-transparent bg-clip-text transition-all"
                                                    style={{
                                                        backgroundImage: `linear-gradient(135deg, ${faenaColor}, ${faenaColorDark})`
                                                    }}
                                                >
                                                    {modulo.nombre}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                    {modulo.descripcion}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Roles */}
                                        {modulo.roles && modulo.roles.length > 0 && (
                                            <div className="mb-5">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold flex items-center gap-2">
                                                    <HiShieldCheck className="w-4 h-4" />
                                                    Tus roles:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {modulo.roles.map((rol, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm border-2 transition-all group-hover:scale-105"
                                                            style={{
                                                                backgroundColor: `${faenaColor}15`,
                                                                color: faenaColorDark,
                                                                borderColor: `${faenaColor}30`
                                                            }}
                                                        >
                                                            {rol}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Footer */}
                                        <div className="mt-5 pt-5 border-t-2 border-gray-100">
                                            <div
                                                className="flex items-center justify-center gap-2 font-bold group-hover:gap-3 transition-all py-3 px-4 rounded-xl"
                                                style={{
                                                    color: faenaColor,
                                                    backgroundColor: `${faenaColor}10`
                                                }}
                                            >
                                                <span>Acceder al módulo</span>
                                                <HiArrowTopRightOnSquare className="w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500">
                        Sistema de Gestión Minera • Portal Corporativo v2.0
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        🔒 Conexión segura y encriptada
                    </p>
                </div>
            </footer>
        </div>
    );
}