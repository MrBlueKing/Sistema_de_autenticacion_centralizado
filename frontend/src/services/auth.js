import api from './api';

class AuthService {
  async login(rut, password) {
    try {
      const response = await api.post('/auth/login', { rut, password });
      const { token, user } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error logout:', error);
    } finally {
      // ✅ Siempre limpiar TODO
      this.clearSession();
    }
  }

  // ✅ NUEVO: Método centralizado para limpiar sesión
  clearSession() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // Si tienes más items, agrégalos aquí
    console.log('🧹 Sesión limpiada completamente');
  }

  async getModulos() {
    try {
      const response = await api.get('/modulos');
      return response.data.modulos;
    } catch (error) {
      console.error('Error módulos:', error);
      return [];
    }
  }

  // ✅ NUEVO: Validar si el token actual es válido
  async validateCurrentToken() {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const response = await api.get('/auth/user');
      return response.status === 200;
    } catch (error) {
      // Token inválido o expirado
      console.log('❌ Token inválido, limpiando sesión...');
      this.clearSession();
      return false;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }
}

export default new AuthService();