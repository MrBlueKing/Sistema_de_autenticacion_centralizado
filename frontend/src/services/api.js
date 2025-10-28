import axios from 'axios';
import authService from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Manejar errores 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es 401 (token inválido/expirado)
    if (error.response?.status === 401) {
      console.log('🔴 401 detectado: Token expirado o inválido');
      
      // ✅ Limpiar TODO el localStorage
      authService.clearSession();
      
      // Redirigir a login (solo si no estamos ya ahí)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;