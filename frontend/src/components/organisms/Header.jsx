// src/components/organisms/Header.jsx
import PropTypes from 'prop-types';
import { Button } from '../atoms';
import { HeaderProfile } from '../molecules';
import { HiArrowRightOnRectangle } from 'react-icons/hi2';

export default function Header({ 
  user,
  onLogout,
  className = ''
}) {
  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Profile Section */}
          <HeaderProfile 
            nombre={user.nombre}
            apellido={user.apellido}
            title="Portal de Sistemas"
          />

          {/* Logout Button */}
          <Button 
            onClick={onLogout}
            variant="ghost"
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

Header.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  className: PropTypes.string,
};