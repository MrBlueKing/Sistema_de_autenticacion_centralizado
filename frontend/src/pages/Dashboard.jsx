import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRightOnRectangle, HiUser } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth';

export default function Dashboard() {
    const { user, logout } = useAuth(); // 👈 Usar el contexto
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
        await logout(); // 👈 Logout del contexto
        navigate('/login'); // 👈 Ahora navigate() funciona!
    };

    const handleModuleClick = (modulo) => {
        const token = authService.getToken();
        console.log("URL:", modulo.url);

        // Usar la URL del módulo directamente de la BD
        const url = `${modulo.url}?token=${token}&modulo_id=${modulo.id}`;

        console.log('🔗 Abriendo módulo:',url); // Para debug

        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <HiUser className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Portal de Sistemas</h1>
                                <p className="text-sm text-gray-500">
                                    Bienvenido, {user?.nombre} {user?.apellido}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <HiArrowRightOnRectangle className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* User Info */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Información del Usuario
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">RUT</p>
                            <p className="font-medium text-gray-900">{user?.rut}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Faena</p>
                            <p className="font-medium text-gray-900">
                                {user?.faena?.ubicacion || 'No asignada'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Módulos */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Módulos Disponibles
                    </h2>

                    {modulos.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <p className="text-yellow-800">No tienes módulos asignados</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modulos.map((modulo) => (
                                <div
                                    key={modulo.id}
                                    onClick={() => handleModuleClick(modulo)}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-indigo-300 p-6 group"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-4xl">{modulo.icono || '📦'}</div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                                                {modulo.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-500">{modulo.descripcion}</p>
                                        </div>
                                    </div>

                                    {/* Roles */}
                                    {modulo.roles && modulo.roles.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-600 mb-2">Roles:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {modulo.roles.map((rol, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded"
                                                    >
                                                        {rol}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-center text-sm font-medium text-indigo-600">
                                            Acceder al módulo →
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}