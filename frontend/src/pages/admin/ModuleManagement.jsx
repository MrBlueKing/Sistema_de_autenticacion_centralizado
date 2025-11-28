import React, { useState, useEffect } from 'react';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/molecules/Modal';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import adminService from '../../services/adminService';

const ModuleManagement = () => {
  const [modulos, setModulos] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingModulo, setEditingModulo] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, modulo: null });

  useEffect(() => {
    loadModulos();
  }, [currentPage, search]);

  const loadModulos = async () => {
    try {
      setLoading(true);
      const response = await adminService.modulos.getAll({
        page: currentPage,
        search,
        per_page: 15
      });
      setModulos(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setEditingModulo(null);
    setShowModal(true);
  };

  const handleEdit = (modulo) => {
    setEditingModulo(modulo);
    setShowModal(true);
  };

  const handleDelete = (modulo) => {
    setConfirmDialog({ isOpen: true, modulo });
  };

  const confirmDelete = async () => {
    try {
      await adminService.modulos.delete(confirmDialog.modulo.id);
      loadModulos();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar módulo');
    }
  };

  const handleToggleStatus = async (modulo) => {
    try {
      await adminService.modulos.toggleStatus(modulo.id);
      loadModulos();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
      url: formData.get('url'),
      icono: formData.get('icono'),
      estado: formData.get('estado') === 'on',
    };

    try {
      if (editingModulo) {
        await adminService.modulos.update(editingModulo.id, data);
      } else {
        await adminService.modulos.create(data);
      }
      setShowModal(false);
      loadModulos();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar módulo');
    }
  };

  const columns = [
    {
      header: 'Módulo',
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{row.icono}</span>
          <div>
            <p className="font-medium text-gray-900">{row.nombre}</p>
            {row.descripcion && (
              <p className="text-sm text-gray-500">{row.descripcion}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'URL',
      render: (row) => (
        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{row.url || '-'}</code>
      ),
    },
    {
      header: 'Usuarios',
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {row.cantidad_usuarios}
        </span>
      ),
    },
    {
      header: 'Permisos',
      render: (row) => (
        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
          {row.cantidad_permisos}
        </span>
      ),
    },
    {
      header: 'Estado',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.estado ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Editar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className="text-yellow-600 hover:text-yellow-800"
            title={row.estado ? 'Desactivar' : 'Activar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800"
            title="Eliminar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Módulos</h1>
            <p className="text-gray-600 mt-1">Administra los módulos del sistema</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          columns={columns}
          data={modulos}
          loading={loading}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
          searchPlaceholder="Buscar módulos..."
          actions={
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Módulo
            </button>
          }
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingModulo ? 'Editar Módulo' : 'Nuevo Módulo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Módulo</label>
            <input
              type="text"
              name="nombre"
              defaultValue={editingModulo?.nombre}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: Producción, Reportes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={editingModulo?.descripcion}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Descripción del módulo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              name="url"
              defaultValue={editingModulo?.url}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="/produccion"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icono (Emoji)</label>
            <input
              type="text"
              name="icono"
              defaultValue={editingModulo?.icono}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="📊"
              maxLength="10"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="estado"
              id="estado"
              defaultChecked={editingModulo?.estado ?? true}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="estado" className="ml-2 text-sm font-medium text-gray-700">
              Módulo activo
            </label>
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
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              {editingModulo ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, modulo: null })}
        onConfirm={confirmDelete}
        title="Eliminar Módulo"
        message={`¿Estás seguro de eliminar el módulo "${confirmDialog.modulo?.nombre}"?`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
};

export default ModuleManagement;
