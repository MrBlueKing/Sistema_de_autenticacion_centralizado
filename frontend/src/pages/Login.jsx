// src/pages/Login.jsx (REFACTORIZADO con Arquitectura Atómica)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthTemplate  from '../components/templates/AuthTemplate';
import LoginCard  from '../components/organisms/LoginCard';

export default function Login() {
  // Estado local
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handlers
  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const result = await login(rut, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // Render
  return (
    <AuthTemplate>
      <LoginCard
        rut={rut}
        setRut={setRut}
        password={password}
        setPassword={setPassword}
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </AuthTemplate>
  );
}