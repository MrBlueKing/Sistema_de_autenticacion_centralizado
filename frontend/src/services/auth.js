import api from './api';

class AuthService {
  /**
   * Login de usuario
   */
  async login(rut, password) {
    try {
      const response = await api.post('/auth/login', { rut, password });
      
      const { token, user } = response.data;
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  }

  /**
   * Logout
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('modulos');
    }
  }

  /**
   * Obtener usuario actual
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/user');
      return response.data.user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener módulos disponibles
   */
  async getModulos() {
    try {
      const response = await api.get('/modulos');
      const modulos = response.data.modulos;
      
      // Guardar en localStorage para acceso rápido
      localStorage.setItem('modulos', JSON.stringify(modulos));
      
      return modulos;
    } catch (error) {
      console.error('Error al obtener módulos:', error);
      return [];
    }
  }

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  /**
   * Obtener usuario del localStorage
   */
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Obtener token
   */
  getToken() {
    return localStorage.getItem('auth_token');
  }

  /**
   * Refrescar token
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('auth_token', token);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();