import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { useAuth } from '../context/AuthContext';

export default function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      
      <Route 
        path="/login" 
        element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} 
      />
      
      <Route 
        path="/dashboard" 
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}