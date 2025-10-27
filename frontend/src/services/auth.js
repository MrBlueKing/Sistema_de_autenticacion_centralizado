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
      localStorage.clear();
    }
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