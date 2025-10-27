// src/components/molecules/LoginTestUsers.jsx
import PropTypes from 'prop-types';

export default function LoginTestUsers({ 
  users = [
    { label: 'Admin', rut: '12345678-9', password: 'password' }
  ],
  className = '' 
}) {
  return (
    <div className={`mt-6 pt-6 border-t border-gray-200 ${className}`}>
      <p className="text-xs text-gray-500 text-center mb-2">
        Usuarios de prueba:
      </p>
      <div className="text-xs text-gray-600 space-y-1">
        {users.map((user, idx) => (
          <div key={idx} className="bg-gray-50 p-2 rounded">
            <strong>{user.label}:</strong> {user.rut} / {user.password}
          </div>
        ))}
      </div>
    </div>
  );
}

LoginTestUsers.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      rut: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
};