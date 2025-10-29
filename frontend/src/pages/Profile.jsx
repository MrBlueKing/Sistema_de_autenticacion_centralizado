// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiArrowLeft, 
  HiUser, 
  HiCube,
  HiUsers,
  HiCalendar,
  HiClock
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/organisms/Profileform';
import PasswordChangeForm from '../components/organisms/Passwordchangeform';
import userService from '../services/userService';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await userService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = (updatedUser) => {
    // Actualizar el usuario en el contexto de autenticación
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Botón volver */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al Dashboard</span>
            </button>

            {/* Título */}
            <h1 className="text-2xl font-bold text-gray-900 hidden md:block">
              Mi Perfil
            </h1>

            {/* Usuario */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <HiUser className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Banner de bienvenida */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold mb-2">
              Configuración de Perfil
            </h2>
            <p className="text-orange-100 text-lg">
              Administra tu información personal y configuraciones de seguridad
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Stat 1 - Módulos */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Módulos Activos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_modulos}</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <HiCube className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Stat 2 - Roles */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Roles Asignados</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_roles}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <HiUsers className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Stat 3 - Cuenta activa */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cuenta Activa Desde</p>
                  <p className="text-lg font-bold text-gray-900">{stats.cuenta_activa_desde}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <HiCalendar className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            {/* Stat 4 - Sesión */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Token Expira</p>
                  <p className="text-sm font-bold text-gray-900">{stats.token_expira_en}</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <HiClock className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formularios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información Personal */}
          <div className="lg:col-span-1">
            <ProfileForm 
              user={user} 
              onUpdateSuccess={handleUpdateSuccess}
            />
          </div>

          {/* Cambio de Contraseña */}
          <div className="lg:col-span-1">
            <PasswordChangeForm />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Información de Cuenta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">RUT:</span>
              <span className="ml-2 font-semibold text-gray-900">{user?.rut}</span>
            </div>
            <div>
              <span className="text-gray-600">Estado:</span>
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                ● Activo
              </span>
            </div>
            {user?.faena && (
              <>
                <div>
                  <span className="text-gray-600">Faena:</span>
                  <span className="ml-2 font-semibold text-gray-900">{user.faena.ubicacion}</span>
                </div>
                {user.faena.detalle && (
                  <div>
                    <span className="text-gray-600">Detalle:</span>
                    <span className="ml-2 font-semibold text-gray-900">{user.faena.detalle}</span>
                  </div>
                )}
              </>
            )}
          </div>
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
};

export default Profile;