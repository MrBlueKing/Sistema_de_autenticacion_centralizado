import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../components/templates/DashboardTemplate';
import Header from '../components/organisms/Header';
import UserInfoCard from '../components/organisms/UserInfoCard';
import ModulesGrid from '../components/organisms/ModulesGrid';
import Alert from '../components/atoms/Alert';
import Spinner from '../components/atoms/Spinner';
import authService from '../services/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Obtener usuario del localStorage
    const userData = authService.getUser();
    setUser(userData);

    // Obtener módulos
    const modulosData = await authService.getModulos();
    setModulos(modulosData);
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleModuleClick = (modulo) => {
    const token = authService.getToken();
    const url = `${modulo.url}?token=${token}`;
    
    // Abrir en nueva pestaña
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardTemplate
      header={
        <Header user={user} onLogout={handleLogout} />
      }
      userInfo={
        <UserInfoCard user={user} />
      }
      modules={
        <ModulesGrid modulos={modulos} onModuleClick={handleModuleClick} />
      }
      infoBox={
        <Alert
          type="info"
          message="💡 Tip: Al hacer clic en un módulo, se abrirá en una nueva pestaña con tu sesión iniciada automáticamente."
        />
      }
    />
  );
}