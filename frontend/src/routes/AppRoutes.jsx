// routes/AppRoutes.jsx - EJEMPLO DE ACTUALIZACIÓN
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile'; // 👈 NUEVO IMPORT

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 👇 NUEVA RUTA DE PERFIL */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}