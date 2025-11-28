import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiHome,
  HiUsers,
  HiShieldCheck,
  HiLockClosed,
  HiCube,
  HiChartBarSquare,
  HiArrowLeft
} from 'react-icons/hi2';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: <HiChartBarSquare className="w-5 h-5" />,
      exact: true
    },
    {
      path: '/admin/users',
      name: 'Usuarios',
      icon: <HiUsers className="w-5 h-5" />
    },
    {
      path: '/admin/roles',
      name: 'Roles',
      icon: <HiShieldCheck className="w-5 h-5" />
    },
    {
      path: '/admin/permisos',
      name: 'Permisos',
      icon: <HiLockClosed className="w-5 h-5" />
    },
    {
      path: '/admin/modulos',
      name: 'Módulos',
      icon: <HiCube className="w-5 h-5" />
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const getCurrentPageName = () => {
    const currentItem = menuItems.find(item => isActive(item));
    return currentItem ? currentItem.name : 'Panel de Administración';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <HiShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-blue-100 text-sm">Gestión del sistema</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm border border-white/20"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al Inicio</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-80px)] sticky top-0">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={active ? 'text-blue-600' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">Sistema de Gestión</p>
              <p className="text-xs text-gray-400 mt-1">Versión 2.0</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <HiHome className="w-4 h-4" />
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                to="/admin"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Administración
              </Link>
              {location.pathname !== '/admin' && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-900 font-medium">
                    {getCurrentPageName()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
