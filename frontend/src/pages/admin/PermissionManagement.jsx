import React, { useState, useEffect } from 'react';
import Modal from '../../components/molecules/Modal';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import adminService from '../../services/adminService';

const PermissionManagement = () => {
  const [permisosPorModulo, setPermisosPorModulo] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPermiso, setEditingPermiso] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, permiso: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [permisosRes, modulosRes] = await Promise.all([
        adminService.permisos.getAll(),
        adminService.modulos.getAll({ all: true })
      ]);
      setPermisosPorModulo(permisosRes.data);
      setModulos(modulosRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPermiso(null);
    setShowModal(true);
  };

  const handleEdit = (permiso) => {
    setEditingPermiso(permiso);
    setShowModal(true);
  };

  const handleDelete = (permiso) => {
    setConfirmDialog({ isOpen: true, permiso });
  };

  const confirmDelete = async () => {
    try {
      await adminService.permisos.delete(confirmDialog.permiso.id);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar permiso');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
      modulo_id: parseInt(formData.get('modulo_id')),
    };

    try {
      if (editingPermiso) {
        await adminService.permisos.update(editingPermiso.id, data);
      } else {
        await adminService.permisos.create(data);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar permiso');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Permisos</h1>
              <p className="text-gray-600 mt-1">Administra los permisos del sistema organizados por módulo</p>
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Permiso
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {permisosPorModulo.map((grupo) => (
            <div key={grupo.modulo.id} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{grupo.modulo.icono}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{grupo.modulo.nombre}</h3>
                    {grupo.modulo.descripcion && (
                      <p className="text-sm text-gray-600">{grupo.modulo.descripcion}</p>
                    )}
                  </div>
                  <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {grupo.permisos.length} permisos
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grupo.permisos.map((permiso) => (
                    <div
                      key={permiso.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{permiso.nombre}</h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              permiso.tipo === 'lectura' ? 'bg-blue-100 text-blue-800' :
                              permiso.tipo === 'escritura' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {permiso.tipo}
                            </span>
                          </div>
                          {permiso.descripcion && (
                            <p className="text-sm text-gray-600 mt-1">{permiso.descripcion}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Usado en {permiso.cantidad_roles} rol(es)
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 ml-2">
                          <button
                            onClick={() => handleEdit(permiso)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(permiso)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPermiso ? 'Editar Permiso' : 'Nuevo Permiso'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Permiso</label>
            <input
              type="text"
              name="nombre"
              defaultValue={editingPermiso?.nombre}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ej: ver_reportes, crear_usuario"
            />
            <p className="text-xs text-gray-500 mt-1">
              Convención: usar_minúsculas_con_guiones_bajos
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={editingPermiso?.descripcion}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Descripción del permiso"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
            <select
              name="modulo_id"
              defaultValue={editingPermiso?.modulo_id}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Seleccionar módulo</option>
              {modulos.map((modulo) => (
                <option key={modulo.id} value={modulo.id}>
                  {modulo.icono} {modulo.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingPermiso ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, permiso: null })}
        onConfirm={confirmDelete}
        title="Eliminar Permiso"
        message={`¿Estás seguro de eliminar el permiso "${confirmDialog.permiso?.nombre}"?`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
};

export default PermissionManagement;
