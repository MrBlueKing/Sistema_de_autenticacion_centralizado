import api from './api';

const adminService = {
  // Dashboard
  dashboard: {
    getStats: () => api.get('/admin/dashboard/stats'),
    getRecentUsers: () => api.get('/admin/dashboard/recent-users'),
    getUsersByFaena: () => api.get('/admin/dashboard/users-by-faena'),
    getTopRoles: () => api.get('/admin/dashboard/top-roles'),
    getRecentActivity: () => api.get('/admin/dashboard/recent-activity'),
    checkAdmin: () => api.get('/admin/dashboard/check-admin'),
  },

  // Users
  users: {
    getAll: (params) => api.get('/admin/users', { params }),
    getOne: (id) => api.get(`/admin/users/${id}`),
    create: (data) => api.post('/admin/users', data),
    update: (id, data) => api.put(`/admin/users/${id}`, data),
    delete: (id) => api.delete(`/admin/users/${id}`),
    toggleStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
    assignRoles: (id, data) => api.post(`/admin/users/${id}/assign-roles`, data),
    removeRole: (id, data) => api.delete(`/admin/users/${id}/remove-role`, { data }),
    getRoles: (id) => api.get(`/admin/users/${id}/roles`),
  },

  // Roles
  roles: {
    getAll: (params) => api.get('/admin/roles', { params }),
    getOne: (id) => api.get(`/admin/roles/${id}`),
    create: (data) => api.post('/admin/roles', data),
    update: (id, data) => api.put(`/admin/roles/${id}`, data),
    delete: (id) => api.delete(`/admin/roles/${id}`),
    toggleStatus: (id) => api.patch(`/admin/roles/${id}/toggle-status`),
    assignPermisos: (id, data) => api.post(`/admin/roles/${id}/assign-permisos`, data),
    getPermisos: (id) => api.get(`/admin/roles/${id}/permisos`),
    getUsuarios: (id) => api.get(`/admin/roles/${id}/usuarios`),
  },

  // Permisos
  permisos: {
    getAll: (params) => api.get('/admin/permisos', { params }),
    getOne: (id) => api.get(`/admin/permisos/${id}`),
    create: (data) => api.post('/admin/permisos', data),
    update: (id, data) => api.put(`/admin/permisos/${id}`, data),
    delete: (id) => api.delete(`/admin/permisos/${id}`),
    getByModulo: (moduloId) => api.get(`/admin/permisos/modulo/${moduloId}`),
    getRoles: (id) => api.get(`/admin/permisos/${id}/roles`),
  },

  // Módulos
  modulos: {
    getAll: (params) => api.get('/admin/modulos', { params }),
    getOne: (id) => api.get(`/admin/modulos/${id}`),
    create: (data) => api.post('/admin/modulos', data),
    update: (id, data) => api.put(`/admin/modulos/${id}`, data),
    delete: (id) => api.delete(`/admin/modulos/${id}`),
    toggleStatus: (id) => api.patch(`/admin/modulos/${id}/toggle-status`),
    getStats: (id) => api.get(`/admin/modulos/${id}/stats`),
    getUsuarios: (id) => api.get(`/admin/modulos/${id}/usuarios`),
    getRoles: (id) => api.get(`/admin/modulos/${id}/roles`),
  },

  // Faenas
  faenas: {
    create: (data) => api.post('/admin/faenas', data),
    update: (id, data) => api.put(`/admin/faenas/${id}`, data),
    delete: (id) => api.delete(`/admin/faenas/${id}`),
    toggleStatus: (id) => api.patch(`/admin/faenas/${id}/toggle-status`),
  },
};

export default adminService;
