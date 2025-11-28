import React, { useState, useEffect } from 'react';
import DataTable from '../../components/organisms/DataTable';
import Modal from '../../components/molecules/Modal';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import adminService from '../../services/adminService';
import api from '../../services/api';
import useToast from '../../hooks/useToast';

const UserManagement = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [faenas, setFaenas] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, user: null });
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [managingRolesUser, setManagingRolesUser] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [savingRole, setSavingRole] = useState(false);

  useEffect(() => {
    loadUsers();
    loadFaenas();
    loadModulos();
    loadAllRoles();
  }, [currentPage, search]);

  const loadFaenas = async () => {
    try {
      const response = await api.get('/faenas');
      setFaenas(response.data.data || []);
    } catch (error) {
      console.error('Error loading faenas:', error);
    }
  };

  const loadModulos = async () => {
    try {
      const response = await adminService.modulos.getAll({ per_page: 100 });
      setModulos(response.data.data || []);
    } catch (error) {
      console.error('Error loading modulos:', error);
    }
  };

  const loadAllRoles = async () => {
    try {
      const response = await adminService.roles.getAll({ per_page: 100 });
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.users.getAll({
        page: currentPage,
        search,
        per_page: 15
      });
      setUsers(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setConfirmDialog({ isOpen: true, user });
  };

  const confirmDelete = async () => {
    try {
      await adminService.users.delete(confirmDialog.user.id);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await adminService.users.toggleStatus(user.id);
      loadUsers();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      rut: formData.get('rut'),
      nombre: formData.get('nombre'),
      apellido: formData.get('apellido'),
      email: formData.get('email'),
      id_faena: parseInt(formData.get('id_faena')),
      estado: formData.get('estado') === 'on',
    };

    if (formData.get('password')) {
      data.password = formData.get('password');
    }

    try {
      if (editingUser) {
        await adminService.users.update(editingUser.id, data);
      } else {
        await adminService.users.create(data);
      }
      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleManageRoles = async (user) => {
    setManagingRolesUser(user);
    try {
      const response = await adminService.users.getRoles(user.id);
      // El backend devuelve una estructura agrupada por módulo, necesitamos aplanarla
      const rolesAgrupados = response.data || [];
      const rolesPlanos = [];
      rolesAgrupados.forEach(grupo => {
        grupo.roles.forEach(rol => {
          rolesPlanos.push({
            modulo_id: grupo.modulo.id,
            rol_id: rol.id,
            rol_nombre: rol.nombre,
            modulo_nombre: grupo.modulo.nombre
          });
        });
      });
      setUserRoles(rolesPlanos);
      setShowRolesModal(true);
    } catch (error) {
      console.error('Error loading user roles:', error);
      alert('Error al cargar roles del usuario');
    }
  };

  const handleToggleUserRole = async (moduloId, rolId) => {
    if (savingRole) return; // Evitar clicks múltiples

    // Verificar si el usuario ya tiene este rol en este módulo
    const hasRole = userRoles.some(
      ur => ur.modulo_id === moduloId && ur.rol_id === rolId
    );

    setSavingRole(true);
    try {
      // Obtener todos los roles actuales del usuario en este módulo
      const currentRolesInModule = userRoles
        .filter(ur => ur.modulo_id === moduloId)
        .map(ur => ur.rol_id);

      let newRolesInModule;
      if (hasRole) {
        // Remover este rol
        newRolesInModule = currentRolesInModule.filter(id => id !== rolId);
      } else {
        // Agregar este rol
        newRolesInModule = [...currentRolesInModule, rolId];
      }

      // Enviar la lista completa de roles para este módulo
      await adminService.users.assignRoles(managingRolesUser.id, {
        modulo_id: moduloId,
        rol_ids: newRolesInModule
      });

      // Recargar roles del usuario
      const response = await adminService.users.getRoles(managingRolesUser.id);
      const rolesAgrupados = response.data || [];
      const rolesPlanos = [];
      rolesAgrupados.forEach(grupo => {
        grupo.roles.forEach(rol => {
          rolesPlanos.push({
            modulo_id: grupo.modulo.id,
            rol_id: rol.id,
            rol_nombre: rol.nombre,
            modulo_nombre: grupo.modulo.nombre
          });
        });
      });
      setUserRoles(rolesPlanos);
      loadUsers(); // Recargar la lista de usuarios para actualizar el contador

      // Mostrar mensaje de éxito
      toast.success('Roles actualizados', 'Los roles del usuario se han guardado correctamente');
    } catch (error) {
      console.error('Error managing role:', error);
      toast.error('Error al gestionar rol', error.response?.data?.message || 'No se pudo actualizar los roles');
    } finally {
      setSavingRole(false);
    }
  };

  const columns = [
    {
      header: 'RUT',
      accessor: 'rut',
    },
    {
      header: 'Nombre',
      render: (row) => `${row.nombre} ${row.apellido}`,
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Faena',
      render: (row) => (
        <span
          className="px-2 py-1 rounded text-xs font-medium text-white"
          style={{ backgroundColor: row.faena?.color }}
        >
          {row.faena?.ubicacion}
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
      header: 'Admin',
      render: (row) => row.es_admin ? (
        <span className="text-purple-600 font-medium">✓</span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      header: 'Roles',
      render: (row) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
          row.cantidad_roles > 0
            ? 'bg-purple-100 text-purple-800'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {row.cantidad_roles || 0}
        </span>
      ),
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleManageRoles(row)}
            className="text-purple-600 hover:text-purple-800"
            title="Gestionar roles"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </button>
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
          searchPlaceholder="Buscar por nombre, RUT o email..."
          actions={
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Usuario
            </button>
          }
        />
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
            <input
              type="text"
              name="rut"
              defaultValue={editingUser?.rut}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                defaultValue={editingUser?.nombre}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                defaultValue={editingUser?.apellido}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={editingUser?.email}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {editingUser && '(dejar en blanco para no cambiar)'}
            </label>
            <input
              type="password"
              name="password"
              required={!editingUser}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Faena</label>
            <select
              name="id_faena"
              defaultValue={editingUser?.faena?.id}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar faena</option>
              {faenas.map((faena) => (
                <option key={faena.id} value={faena.id}>
                  {faena.ubicacion}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="estado"
              id="estado"
              defaultChecked={editingUser?.estado ?? true}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="estado" className="ml-2 text-sm font-medium text-gray-700">
              Usuario activo
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingUser ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Roles Management */}
      <Modal
        isOpen={showRolesModal}
        onClose={() => setShowRolesModal(false)}
        title={`Gestionar Roles - ${managingRolesUser?.nombre} ${managingRolesUser?.apellido}`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Usuario:</strong> {managingRolesUser?.nombre} {managingRolesUser?.apellido} ({managingRolesUser?.rut})
            </p>
            <p className="text-sm text-blue-800 mt-1">
              {savingRole ? '💾 Guardando cambios...' : 'Selecciona los roles que deseas asignar a este usuario en cada módulo. Los cambios se guardan automáticamente.'}
            </p>
          </div>

          {modulos.map((modulo) => (
            <div key={modulo.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">{modulo.icono || '📦'}</span>
                {modulo.nombre}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {roles
                  .filter(role => role.estado)
                  .map((role) => {
                    const isAssigned = userRoles.some(
                      ur => ur.modulo_id === modulo.id && ur.rol_id === role.id
                    );
                    return (
                      <label
                        key={role.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isAssigned
                            ? 'bg-purple-50 border-purple-500'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={() => handleToggleUserRole(modulo.id, role.id)}
                          disabled={savingRole}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{role.nombre}</p>
                          {role.descripcion && (
                            <p className="text-xs text-gray-600">{role.descripcion}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                {roles.filter(role => role.estado).length === 0 && (
                  <p className="text-gray-500 text-sm col-span-2">No hay roles disponibles</p>
                )}
              </div>
            </div>
          ))}

          {modulos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay módulos disponibles
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowRolesModal(false)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, user: null })}
        onConfirm={confirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de eliminar al usuario ${confirmDialog.user?.nombre} ${confirmDialog.user?.apellido}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
};

export default UserManagement;
