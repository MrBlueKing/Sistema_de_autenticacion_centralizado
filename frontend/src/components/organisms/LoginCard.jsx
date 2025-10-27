// src/components/organisms/LoginCard.jsx
import PropTypes from 'prop-types';
import Logo  from '../atoms/Logo';
import LoginTestUsers  from '../molecules/LoginTestUsers';
import LoginForm from './LoginForm';
import { HiLockClosed } from 'react-icons/hi2';

export default function LoginCard({ 
  rut,
  setRut,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  className = ''
}) {
  return (
    <div className={`max-w-md w-full ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <Logo icon={HiLockClosed} size="lg" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sistema de Autenticación
        </h1>
        <p className="text-gray-600">Ingresa tus credenciales</p>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        {/* Login Form */}
        <LoginForm
          rut={rut}
          setRut={setRut}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={onSubmit}
        />

        {/* Test Users */}
        <LoginTestUsers />
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Sistema Central v1.0
      </p>
    </div>
  );
}

LoginCard.propTypes = {
  rut: PropTypes.string.isRequired,
  setRut: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
};