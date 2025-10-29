// services/userService.js
import api from './api';

const userService = {
  /**
   * Obtener el perfil completo del usuario
   */
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data.user;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  /**
   * Actualizar información básica del perfil
   */
  updateProfile: async (data) => {
    try {
      const response = await api.put('/user/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  /**
   * Cambiar contraseña
   */
  changePassword: async (data) => {
    try {
      const response = await api.put('/user/change-password', data);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas del usuario
   */
  getStats: async () => {
    try {
      const response = await api.get('/user/stats');
      return response.data.stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },
};

export default userService;