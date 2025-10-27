// src/components/organisms/LoginForm.jsx
import PropTypes from 'prop-types';
import Button from '../atoms/Button';
import ErrorAlert from '../atoms/ErrorAlert';
import InputGroup  from '../molecules/InputGroup';
import { HiUser, HiLockClosed } from 'react-icons/hi2';

export default function LoginForm({ 
  rut,
  setRut,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  className = ''
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Error Alert */}
      {error && <ErrorAlert message={error} />}

      {/* RUT Input */}
      <InputGroup
        label="RUT"
        icon={HiUser}
        type="text"
        value={rut}
        onChange={(e) => setRut(e.target.value)}
        placeholder="12345678-9"
        autoComplete="username"
        required
      />

      {/* Password Input */}
      <InputGroup
        label="Contraseña"
        icon={HiLockClosed}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />

      {/* Submit Button */}
      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        disabled={loading}
      >
        {loading ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
}

LoginForm.propTypes = {
  rut: PropTypes.string.isRequired,
  setRut: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
};