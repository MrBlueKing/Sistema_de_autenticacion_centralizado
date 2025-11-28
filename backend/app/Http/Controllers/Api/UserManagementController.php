<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Rol;
use App\Models\Modulo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    /**
     * Listar todos los usuarios con paginación y filtros
     */
    public function index(Request $request)
    {
        $query = User::with(['faena', 'roles']);

        // Filtro por nombre/apellido/rut/email
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('apellido', 'like', "%{$search}%")
                  ->orWhere('rut', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por estado
        if ($request->has('estado') && $request->estado !== '') {
            $query->where('estado', $request->estado);
        }

        // Filtro por faena
        if ($request->has('faena_id') && $request->faena_id !== '') {
            $query->where('id_faena', $request->faena_id);
        }

        // Filtro por administradores
        if ($request->has('solo_admins') && $request->solo_admins == true) {
            $query->whereHas('roles', function($q) {
                $q->where('roles.nombre', 'administrador');
            });
        }

        // Ordenamiento
        $sortField = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        // Paginación
        $perPage = $request->get('per_page', 15);
        $users = $query->paginate($perPage);

        // Transformar datos
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'rut' => $user->rut,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
                'estado' => $user->estado,
                'es_admin' => $user->esAdministrador(),
                'faena' => $user->faena ? [
                    'id' => $user->faena->id,
                    'ubicacion' => $user->faena->ubicacion,
                    'color' => $user->faena->color,
                ] : null,
                'cantidad_roles' => $user->roles->count(),
                'created_at' => $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : null,
                'updated_at' => $user->updated_at ? $user->updated_at->format('Y-m-d H:i:s') : null,
            ];
        });

        return response()->json($users);
    }

    /**
     * Obtener un usuario específico con sus roles por módulo
     */
    public function show($id)
    {
        $user = User::with(['faena', 'roles.permisos'])->findOrFail($id);

        // Agrupar roles por módulo
        $rolesPorModulo = DB::table('usuario_roles')
            ->join('roles', 'usuario_roles.rol_id', '=', 'roles.id')
            ->join('modulos', 'usuario_roles.modulo_id', '=', 'modulos.id')
            ->where('usuario_roles.user_id', $user->id)
            ->select(
                'modulos.id as modulo_id',
                'modulos.nombre as modulo_nombre',
                'roles.id as rol_id',
                'roles.nombre as rol_nombre',
                'roles.descripcion as rol_descripcion'
            )
            ->get()
            ->groupBy('modulo_id');

        return response()->json([
            'id' => $user->id,
            'rut' => $user->rut,
            'nombre' => $user->nombre,
            'apellido' => $user->apellido,
            'email' => $user->email,
            'estado' => $user->estado,
            'es_admin' => $user->esAdministrador(),
            'faena' => $user->faena ? [
                'id' => $user->faena->id,
                'ubicacion' => $user->faena->ubicacion,
                'color' => $user->faena->color,
            ] : null,
            'roles_por_modulo' => $rolesPorModulo,
            'created_at' => $user->created_at ? $user->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $user->updated_at ? $user->updated_at->format('Y-m-d H:i:s') : null,
        ]);
    }

    /**
     * Crear un nuevo usuario
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rut' => 'required|string|unique:users,rut|max:12',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'estado' => 'boolean',
            'id_faena' => 'required|exists:faenas,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['estado'] = $request->get('estado', true);

        $user = User::create($validated);

        // Cargar relaciones
        $user->load('faena');

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => [
                'id' => $user->id,
                'rut' => $user->rut,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
                'estado' => $user->estado,
                'faena' => $user->faena ? [
                    'id' => $user->faena->id,
                    'ubicacion' => $user->faena->ubicacion,
                    'color' => $user->faena->color,
                ] : null,
            ]
        ], 201);
    }

    /**
     * Actualizar un usuario existente
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'rut' => ['required', 'string', 'max:12', Rule::unique('users')->ignore($user->id)],
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'estado' => 'boolean',
            'id_faena' => 'required|exists:faenas,id',
        ]);

        // Solo actualizar password si se envió
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        $user->load('faena');

        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => [
                'id' => $user->id,
                'rut' => $user->rut,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
                'estado' => $user->estado,
                'faena' => $user->faena ? [
                    'id' => $user->faena->id,
                    'ubicacion' => $user->faena->ubicacion,
                    'color' => $user->faena->color,
                ] : null,
            ]
        ]);
    }

    /**
     * Eliminar un usuario
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevenir que el usuario se elimine a sí mismo
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'No puedes eliminar tu propio usuario'
            ], 403);
        }

        // Eliminar roles asociados
        DB::table('usuario_roles')->where('user_id', $user->id)->delete();

        // Eliminar tokens
        $user->tokens()->delete();

        // Eliminar usuario
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }

    /**
     * Cambiar el estado de un usuario (activar/desactivar)
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        // Prevenir que el usuario se desactive a sí mismo
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'No puedes desactivar tu propio usuario'
            ], 403);
        }

        $user->estado = !$user->estado;
        $user->save();

        // Si se desactiva, eliminar sus tokens activos
        if (!$user->estado) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->estado ? 'Usuario activado' : 'Usuario desactivado',
            'estado' => $user->estado
        ]);
    }

    /**
     * Asignar roles a un usuario en un módulo específico
     */
    public function assignRoles(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'modulo_id' => 'required|exists:modulos,id',
            'rol_ids' => 'array',
            'rol_ids.*' => 'exists:roles,id',
        ]);

        $moduloId = $validated['modulo_id'];
        $rolIds = $validated['rol_ids'] ?? [];

        // Eliminar roles existentes del usuario en ese módulo
        DB::table('usuario_roles')
            ->where('user_id', $user->id)
            ->where('modulo_id', $moduloId)
            ->delete();

        // Asignar nuevos roles
        $inserts = [];
        foreach ($rolIds as $rolId) {
            $inserts[] = [
                'user_id' => $user->id,
                'rol_id' => $rolId,
                'modulo_id' => $moduloId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (!empty($inserts)) {
            DB::table('usuario_roles')->insert($inserts);
        }

        return response()->json([
            'message' => 'Roles asignados exitosamente'
        ]);
    }

    /**
     * Eliminar un rol específico de un usuario en un módulo
     */
    public function removeRole(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'rol_id' => 'required|exists:roles,id',
            'modulo_id' => 'required|exists:modulos,id',
        ]);

        DB::table('usuario_roles')
            ->where('user_id', $user->id)
            ->where('rol_id', $validated['rol_id'])
            ->where('modulo_id', $validated['modulo_id'])
            ->delete();

        return response()->json([
            'message' => 'Rol removido exitosamente'
        ]);
    }

    /**
     * Obtener todos los roles de un usuario agrupados por módulo
     */
    public function getUserRoles($id)
    {
        $user = User::findOrFail($id);

        $rolesPorModulo = DB::table('usuario_roles')
            ->join('roles', 'usuario_roles.rol_id', '=', 'roles.id')
            ->join('modulos', 'usuario_roles.modulo_id', '=', 'modulos.id')
            ->where('usuario_roles.user_id', $user->id)
            ->select(
                'modulos.id as modulo_id',
                'modulos.nombre as modulo_nombre',
                'modulos.icono as modulo_icono',
                'roles.id as rol_id',
                'roles.nombre as rol_nombre',
                'roles.descripcion as rol_descripcion'
            )
            ->get()
            ->groupBy('modulo_id')
            ->map(function ($roles, $moduloId) {
                $firstRole = $roles->first();
                return [
                    'modulo' => [
                        'id' => $firstRole->modulo_id,
                        'nombre' => $firstRole->modulo_nombre,
                        'icono' => $firstRole->modulo_icono,
                    ],
                    'roles' => $roles->map(function ($rol) {
                        return [
                            'id' => $rol->rol_id,
                            'nombre' => $rol->rol_nombre,
                            'descripcion' => $rol->rol_descripcion,
                        ];
                    })->values()
                ];
            })->values();

        return response()->json($rolesPorModulo);
    }
}
