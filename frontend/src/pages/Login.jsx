import { useNavigate } from 'react-router-dom';
import AuthTemplate from '../components/templates/AuthTemplate';
import LogoHeader from '../components/molecules/LogoHeader';
import LoginForm from '../components/organisms/LoginForm';
import authService from '../services/auth';
import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async ({ rut, password }) => {
    setLoading(true);

    const result = await authService.login(rut, password);

    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
    return result;
  };

  return (
    <AuthTemplate
      logo={
        <LogoHeader
          title="Sistema de Autenticación"
          subtitle="Ingresa tus credenciales para continuar"
        />
      }
      footer="Sistema Central de Autenticación v1.0"
    >
      <LoginForm onSubmit={handleLogin} loading={loading} />
    </AuthTemplate>
  );
}