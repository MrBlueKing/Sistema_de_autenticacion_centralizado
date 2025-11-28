<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\Permiso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RoleManagementController extends Controller
{
    /**
     * Listar todos los roles con paginación y filtros
     */
    public function index(Request $request)
    {
        $query = Rol::query();

        // Filtro por búsqueda
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        // Filtro por estado
        if ($request->has('estado') && $request->estado !== '') {
            $query->where('estado', $request->estado);
        }

        // Ordenamiento
        $sortField = $request->get('sort_by', 'nombre');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortField, $sortOrder);

        // Paginación
        $perPage = $request->get('per_page', 15);
        $roles = $query->paginate($perPage);

        // Transformar datos
        $roles->getCollection()->transform(function ($rol) {
            return [
                'id' => $rol->id,
                'nombre' => $rol->nombre,
                'descripcion' => $rol->descripcion,
                'estado' => $rol->estado,
                'cantidad_usuarios' => $rol->cantidadUsuarios(),
                'cantidad_permisos' => $rol->permisos()->count(),
                'created_at' => $rol->created_at ? $rol->created_at->format('Y-m-d H:i:s') : null,
                'updated_at' => $rol->updated_at ? $rol->updated_at->format('Y-m-d H:i:s') : null,
            ];
        });

        return response()->json($roles);
    }

    /**
     * Obtener un rol específico con sus permisos
     */
    public function show($id)
    {
        $rol = Rol::with('permisos.modulo')->findOrFail($id);

        $permisosPorModulo = $rol->permisosPorModulo();

        return response()->json([
            'id' => $rol->id,
            'nombre' => $rol->nombre,
            'descripcion' => $rol->descripcion,
            'estado' => $rol->estado,
            'permisos_por_modulo' => $permisosPorModulo,
            'cantidad_usuarios' => $rol->cantidadUsuarios(),
            'created_at' => $rol->created_at ? $rol->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $rol->updated_at ? $rol->updated_at->format('Y-m-d H:i:s') : null,
        ]);
    }

    /**
     * Crear un nuevo rol
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|unique:roles,nombre|max:255',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        $validated['estado'] = $request->get('estado', true);

        $rol = Rol::create($validated);

        return response()->json([
            'message' => 'Rol creado exitosamente',
            'rol' => [
                'id' => $rol->id,
                'nombre' => $rol->nombre,
                'descripcion' => $rol->descripcion,
                'estado' => $rol->estado,
            ]
        ], 201);
    }

    /**
     * Actualizar un rol existente
     */
    public function update(Request $request, $id)
    {
        $rol = Rol::findOrFail($id);

        // Prevenir edición del rol administrador
        if ($rol->nombre === 'administrador') {
            return response()->json([
                'message' => 'No se puede editar el rol administrador'
            ], 403);
        }

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($rol->id)],
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        $rol->update($validated);

        return response()->json([
            'message' => 'Rol actualizado exitosamente',
            'rol' => [
                'id' => $rol->id,
                'nombre' => $rol->nombre,
                'descripcion' => $rol->descripcion,
                'estado' => $rol->estado,
            ]
        ]);
    }

    /**
     * Eliminar un rol
     */
    public function destroy($id)
    {
        $rol = Rol::findOrFail($id);

        // Prevenir eliminación del rol administrador
        if ($rol->nombre === 'administrador') {
            return response()->json([
                'message' => 'No se puede eliminar el rol administrador'
            ], 403);
        }

        // Verificar si el rol está asignado a usuarios
        if ($rol->cantidadUsuarios() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar el rol porque está asignado a usuarios'
            ], 422);
        }

        // Eliminar permisos asociados
        DB::table('rol_permisos')->where('rol_id', $rol->id)->delete();

        // Eliminar rol
        $rol->delete();

        return response()->json([
            'message' => 'Rol eliminado exitosamente'
        ]);
    }

    /**
     * Cambiar el estado de un rol (activar/desactivar)
     */
    public function toggleStatus($id)
    {
        $rol = Rol::findOrFail($id);

        // Prevenir desactivación del rol administrador
        if ($rol->nombre === 'administrador' && $rol->estado) {
            return response()->json([
                'message' => 'No se puede desactivar el rol administrador'
            ], 403);
        }

        $rol->estado = !$rol->estado;
        $rol->save();

        return response()->json([
            'message' => $rol->estado ? 'Rol activado' : 'Rol desactivado',
            'estado' => $rol->estado
        ]);
    }

    /**
     * Asignar permisos a un rol
     */
    public function assignPermisos(Request $request, $id)
    {
        $rol = Rol::findOrFail($id);

        $validated = $request->validate([
            'permiso_ids' => 'required|array',
            'permiso_ids.*' => 'exists:permisos,id',
        ]);

        // Eliminar permisos existentes
        DB::table('rol_permisos')->where('rol_id', $rol->id)->delete();

        // Asignar nuevos permisos
        $inserts = [];
        foreach ($validated['permiso_ids'] as $permisoId) {
            $inserts[] = [
                'rol_id' => $rol->id,
                'permiso_id' => $permisoId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (!empty($inserts)) {
            DB::table('rol_permisos')->insert($inserts);
        }

        return response()->json([
            'message' => 'Permisos asignados exitosamente'
        ]);
    }

    /**
     * Obtener todos los permisos de un rol agrupados por módulo
     */
    public function getPermisos($id)
    {
        $rol = Rol::findOrFail($id);
        $permisosPorModulo = $rol->permisosPorModulo();

        return response()->json($permisosPorModulo);
    }

    /**
     * Obtener usuarios asignados a un rol
     */
    public function getUsuarios($id)
    {
        $rol = Rol::findOrFail($id);

        $usuarios = DB::table('usuario_roles')
            ->join('users', 'usuario_roles.user_id', '=', 'users.id')
            ->join('modulos', 'usuario_roles.modulo_id', '=', 'modulos.id')
            ->where('usuario_roles.rol_id', $rol->id)
            ->select(
                'users.id',
                'users.rut',
                'users.nombre',
                'users.apellido',
                'users.email',
                'modulos.nombre as modulo'
            )
            ->distinct()
            ->get();

        return response()->json($usuarios);
    }
}
