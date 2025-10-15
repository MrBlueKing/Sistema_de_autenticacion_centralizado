import { HiArrowRightOnRectangle, HiUser } from 'react-icons/hi2';
import Button from '../atoms/Button';

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <HiUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Portal de Sistemas
              </h1>
              <p className="text-sm text-gray-500">
                Bienvenido, {user?.nombre} {user?.apellido}
              </p>
            </div>
          </div>

          {/* Botón logout */}
          <Button
            variant="ghost"
            onClick={onLogout}
            className="flex items-center gap-2"
          >
            <HiArrowRightOnRectangle className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}