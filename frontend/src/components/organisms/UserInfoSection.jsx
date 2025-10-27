// src/components/organisms/UserInfoSection.jsx
import PropTypes from 'prop-types';
import { Card } from '../atoms';
import { UserInfoItem } from '../molecules';

export default function UserInfoSection({ 
  user,
  className = ''
}) {
  return (
    <Card className={className}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Información del Usuario
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserInfoItem 
          label="RUT" 
          value={user.rut} 
        />
        
        <UserInfoItem 
          label="Email" 
          value={user.email} 
        />
        
        <UserInfoItem 
          label="Faena" 
          value={user.faena?.ubicacion} 
        />
      </div>
    </Card>
  );
}

UserInfoSection.propTypes = {
  user: PropTypes.shape({
    rut: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    faena: PropTypes.shape({
      ubicacion: PropTypes.string,
    }),
  }).isRequired,
  className: PropTypes.string,
};