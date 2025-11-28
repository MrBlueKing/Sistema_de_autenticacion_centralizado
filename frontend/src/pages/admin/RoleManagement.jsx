import React, { useState, useEffect } from 'react';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/molecules/Modal';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import adminService from '../../services/adminService';
import useToast from '../../hooks/useToast';

const RoleManagement = () => {
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, role: null });
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [managingPermissionsRole, setManagingPermissionsRole] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [rolePermisos, setRolePermisos] = useState([]);
  const [savingPermission, setSavingPermission] = useState(false);

  useEffect(() => {
    loadRoles();
    loadPermisos();
  }, [currentPage, search]);

  const loadPermisos = async () => {
    try {
      const response = await adminService.permisos.getAll({ per_page: 500 });
      setPermisos(response.data.data || []);
    } catch (error) {
      console.error('Error loading permisos:', error);
    }
  };

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await adminService.roles.getAll({
        page: currentPage,
        search,
        per_page: 15
      });
      setRoles(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleDelete = (role) => {
    setConfirmDialog({ isOpen: true, role });
  };

  const confirmDelete = async () => {
    try {
      await adminService.roles.delete(confirmDialog.role.id);
      loadRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      alert(error.response?.data?.message || 'Error al eliminar rol');
    }
  };

  const handleToggleStatus = async (role) => {
    try {
      await adminService.roles.toggleStatus(role.id);
      loadRoles();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
      estado: formData.get('estado') === 'on',
    };

    try {
      if (editingRole) {
        await adminService.roles.update(editingRole.id, data);
      } else {
        await adminService.roles.create(data);
      }
      setShowModal(false);
      loadRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      alert(error.response?.data?.message || 'Error al guardar rol');
    }
  };

  const handleManagePermissions = async (role) => {
    setManagingPermissionsRole(role);
    try {
      const response = await adminService.roles.getPermisos(role.id);
      setRolePermisos(response.data.permisos || []);
      setShowPermissionsModal(true);
    } catch (error) {
      console.error('Error loading role permissions:', error);
      alert('Error al cargar permisos del rol');
    }
  };

  const handleTogglePermission = async (permisoId) => {
    if (savingPermission) return; // Evitar clicks múltiples

    const hasPermission = rolePermisos.some(p => p.id === permisoId);

    setSavingPermission(true);
    try {
      const currentPermisos = rolePermisos.map(p => p.id);
      let newPermisos;

      if (hasPermission) {
        newPermisos = currentPermisos.filter(id => id !== permisoId);
      } else {
        newPermisos = [...currentPermisos, permisoId];
      }

      await adminService.roles.assignPermisos(managingPermissionsRole.id, {
        permiso_ids: newPermisos
      });

      const response = await adminService.roles.getPermisos(managingPermissionsRole.id);
      setRolePermisos(response.data.permisos || []);
      loadRoles(); // Recargar la lista de roles para actualizar el contador

      // Mostrar mensaje de éxito
      toast.success('Permisos actualizados', 'Los permisos del rol se han guardado correctamente');
    } catch (error) {
      console.error('Error managing permission:', error);
      toast.error('Error al gestionar permiso', error.response?.data?.message || 'No se pudo actualizar los permisos');
    } finally {
      setSavingPermission(false);
    }
  };

  const columns = [
    {
      header: 'Nombre',
      accessor: 'nombre',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.nombre}</p>
          {row.descripcion && (
            <p className="text-sm text-gray-500">{row.descripcion}</p>
          )}
        </div>
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
            onClick={() => handleManagePermissions(row)}
            className="text-green-600 hover:text-green-800"
            title="Gestionar permisos"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Editar"
            disabled={row.nombre === 'administrador'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className="text-yellow-600 hover:text-yellow-800"
            title={row.estado ? 'Desactivar' : 'Activar'}
            disabled={row.nombre === 'administrador' && row.estado}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
            title="Eliminar"
            disabled={row.nombre === 'administrador'}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles</h1>
              <p className="text-gray-600 mt-1">Administra los roles del sistema y sus permisos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          columns={columns}
          data={roles}
          loading={loading}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
          searchPlaceholder="Buscar roles..."
          actions={
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Rol
            </button>
          }
        />
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRole ? 'Editar Rol' : 'Nuevo Rol'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
            <input
              type="text"
              name="nombre"
              defaultValue={editingRole?.nombre}
              required
              disabled={editingRole?.nombre === 'administrador'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Ej: supervisor, operador"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={editingRole?.descripcion}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Descripción del rol y sus responsabilidades"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="estado"
              id="estado"
              defaultChecked={editingRole?.estado ?? true}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="estado" className="ml-2 text-sm font-medium text-gray-700">
              Rol activo
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
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {editingRole ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Permissions Management */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        title={`Gestionar Permisos - Rol: ${managingPermissionsRole?.nombre}`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>Rol:</strong> {managingPermissionsRole?.nombre}
            </p>
            <p className="text-sm text-purple-800 mt-1">
              {savingPermission ? '💾 Guardando cambios...' : 'Selecciona los permisos que deseas asignar a este rol. Los cambios se guardan automáticamente.'}
            </p>
          </div>

          {/* Agrupar permisos por módulo */}
          {permisos.reduce((acc, permiso) => {
            const moduloNombre = permiso.modulo?.nombre || 'Sin módulo';
            if (!acc[moduloNombre]) {
              acc[moduloNombre] = [];
            }
            acc[moduloNombre].push(permiso);
            return acc;
          }, {})}

          {Object.entries(
            permisos.reduce((acc, permiso) => {
              const moduloNombre = permiso.modulo?.nombre || 'Sin módulo';
              const moduloIcono = permiso.modulo?.icono || '📦';
              if (!acc[moduloNombre]) {
                acc[moduloNombre] = { icono: moduloIcono, permisos: [] };
              }
              acc[moduloNombre].permisos.push(permiso);
              return acc;
            }, {})
          ).map(([moduloNombre, data]) => (
            <div key={moduloNombre} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">{data.icono}</span>
                {moduloNombre}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.permisos.map((permiso) => {
                  const isAssigned = rolePermisos.some(p => p.id === permiso.id);
                  return (
                    <label
                      key={permiso.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isAssigned
                          ? 'bg-green-50 border-green-500'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        onChange={() => handleTogglePermission(permiso.id)}
                        disabled={savingPermission}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{permiso.nombre}</p>
                        {permiso.descripcion && (
                          <p className="text-xs text-gray-600">{permiso.descripcion}</p>
                        )}
                        {permiso.tipo && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                            {permiso.tipo}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {permisos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay permisos disponibles
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowPermissionsModal(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, role: null })}
        onConfirm={confirmDelete}
        title="Eliminar Rol"
        message={`¿Estás seguro de eliminar el rol "${confirmDialog.role?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
};

export default RoleManagement;
