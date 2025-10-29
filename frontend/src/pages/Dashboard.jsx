// Dashboard.jsx - VERSIÓN PROFESIONAL MEJORADA
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HiArrowRightOnRectangle,
    HiUser,
    HiShieldCheck,
    HiCube,
    HiUsers,
    HiChartBar,
    HiArrowTopRightOnSquare
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadModulos();
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-orange-50">
            {/* Header Profesional */}
            <header className="bg-white shadow-md border-b-2 border-orange-500">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo + Title */}
                        <div className="flex items-center gap-4">
                            {/* Logo empresarial - puedes cambiarlo por tu logo real */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl blur-md opacity-30"></div>
                                <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <HiShieldCheck className="w-7 h-7 text-white" />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Portal Corporativo
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Sistema de Gestión Minera
                                </p>
                            </div>
                        </div>

                        {/* User Info + Logout */}
                        <div className="flex items-center gap-4">
                            {/* User Badge */}
                            {/* User Badge - VERSIÓN ACTUALIZADA CON NAVEGACIÓN */}
                            <button
                                onClick={() => navigate('/profile')}
                                className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-orange-300 transition-all duration-200 cursor-pointer"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                                    <HiUser className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {user?.nombre} {user?.apellido}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.faena?.ubicacion || 'Sin faena'}
                                    </p>
                                </div>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
                            >
                                <HiArrowRightOnRectangle className="w-5 h-5" />
                                <span className="hidden sm:inline font-medium">Cerrar Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
                    {/* Patrón decorativo */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative">
                        <h2 className="text-3xl font-bold mb-2">
                            ¡Bienvenido, {user?.nombre}! 👋
                        </h2>
                        <p className="text-orange-100 text-lg">
                            Accede a tus módulos y gestiona tu trabajo de forma eficiente
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stat 1 */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Módulos Disponibles</p>
                                <p className="text-3xl font-bold text-gray-900">{modulos.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                                <HiCube className="w-7 h-7 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Roles Activos</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {modulos.reduce((acc, m) => acc + (m.roles?.length || 0), 0)}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                <HiUsers className="w-7 h-7 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Faena Asignada</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {user?.faena?.ubicacion || 'No asignada'}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                                <HiChartBar className="w-7 h-7 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Details Card */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <HiUser className="w-5 h-5 text-orange-600" />
                        Información del Usuario
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">RUT</p>
                            <p className="font-semibold text-gray-900">{user?.rut}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                            <p className="font-semibold text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Estado</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                ● Activo
                            </span>
                        </div>
                    </div>
                </div>

                {/* Módulos Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Tus Módulos
                        </h2>
                        <span className="text-sm text-gray-500">
                            {modulos.length} módulo{modulos.length !== 1 ? 's' : ''} disponible{modulos.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {modulos.length === 0 ? (
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
                        // Módulos Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modulos.map((modulo) => (
                                <div
                                    key={modulo.id}
                                    onClick={() => handleModuleClick(modulo)}
                                    className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-orange-400 p-6 group transform hover:-translate-y-1"
                                >
                                    {/* Module Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="text-5xl flex-shrink-0">
                                            {modulo.icono || '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors mb-1 truncate">
                                                {modulo.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {modulo.descripcion}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Roles */}
                                    {modulo.roles && modulo.roles.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                                Tus roles:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {modulo.roles.map((rol, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200"
                                                    >
                                                        {rol}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Footer */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                                            <span>Acceder al módulo</span>
                                            <HiArrowTopRightOnSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
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