import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Al cargar la app, verificar si hay sesión válida
  useEffect(() => {
    validateSession();
  }, []);

  // ✅ NUEVO: Validar sesión al cargar
  const validateSession = async () => {
    const userData = authService.getUser();
    const token = authService.getToken();

    // Si hay user pero no token, limpiar
    if (userData && !token) {
      console.log('⚠️ User sin token, limpiando...');
      authService.clearSession();
      setUser(null);
      setLoading(false);
      return;
    }

    // Si hay token, validar que sea válido
    if (token) {
      const isValid = await authService.validateCurrentToken();
      
      if (isValid) {
        console.log('✅ Token válido, sesión restaurada');
        setUser(userData);
      } else {
        console.log('❌ Token inválido, sesión limpiada');
        setUser(null);
      }
    }

    setLoading(false);
  };

  // Al cargar la app, verificar si hay sesión
  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const login = async (rut, password) => {
    const result = await authService.login(rut, password);
    if (result.success) {
      setUser(result.user); // 👈 Actualizar estado global
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null); // 👈 Limpiar estado global
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};