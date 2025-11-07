// src/components/molecules/HeaderProfile.jsx
import PropTypes from 'prop-types';
import Avatar from '../atoms/Avatar';
import { HiUsers } from "react-icons/hi2";

export default function HeaderProfile({ 
  nombre, 
  apellido,
  title = 'Portal de Sistemas',
  className = '' 
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar icon={HiUsers} size="md" />
      
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">
          Bienvenido, {nombre} {apellido}
        </p>
      </div>
    </div>
  );
}

HeaderProfile.propTypes = {
  nombre: PropTypes.string.isRequired,
  apellido: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};