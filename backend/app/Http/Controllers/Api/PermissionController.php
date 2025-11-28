<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permiso;
use App\Models\Modulo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
    /**
     * Listar todos los permisos agrupados por módulo
     */
    public function index(Request $request)
    {
        $moduloId = $request->get('modulo_id');

        $query = Permiso::with('modulo');

        if ($moduloId) {
            $query->where('modulo_id', $moduloId);
        }

        $permisos = $query->orderBy('modulo_id')->orderBy('nombre')->get();

        // Agrupar por módulo
        $permisosPorModulo = $permisos->groupBy('modulo_id')->map(function ($permisos, $moduloId) {
            $modulo = $permisos->first()->modulo;

            return [
                'modulo' => [
                    'id' => $modulo->id,
                    'nombre' => $modulo->nombre,
                    'descripcion' => $modulo->descripcion,
                    'icono' => $modulo->icono,
                ],
                'permisos' => $permisos->map(function ($permiso) {
                    return [
                        'id' => $permiso->id,
                        'nombre' => $permiso->nombre,
                        'descripcion' => $permiso->descripcion,
                        'tipo' => $permiso->tipo(),
                        'cantidad_roles' => $permiso->cantidadRoles(),
                    ];
                })
            ];
        })->values();

        return response()->json($permisosPorModulo);
    }

    /**
     * Obtener un permiso específico
     */
    public function show($id)
    {
        $permiso = Permiso::with('modulo')->findOrFail($id);

        return response()->json([
            'id' => $permiso->id,
            'nombre' => $permiso->nombre,
            'descripcion' => $permiso->descripcion,
            'tipo' => $permiso->tipo(),
            'modulo' => [
                'id' => $permiso->modulo->id,
                'nombre' => $permiso->modulo->nombre,
            ],
            'cantidad_roles' => $permiso->cantidadRoles(),
        ]);
    }

    /**
     * Crear un nuevo permiso
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'modulo_id' => 'required|exists:modulos,id',
        ]);

        // Verificar unicidad del nombre dentro del módulo
        $exists = Permiso::where('nombre', $validated['nombre'])
                        ->where('modulo_id', $validated['modulo_id'])
                        ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Ya existe un permiso con este nombre en el módulo'
            ], 422);
        }

        $permiso = Permiso::create($validated);

        return response()->json([
            'message' => 'Permiso creado exitosamente',
            'permiso' => [
                'id' => $permiso->id,
                'nombre' => $permiso->nombre,
                'descripcion' => $permiso->descripcion,
                'modulo_id' => $permiso->modulo_id,
            ]
        ], 201);
    }

    /**
     * Actualizar un permiso existente
     */
    public function update(Request $request, $id)
    {
        $permiso = Permiso::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'modulo_id' => 'required|exists:modulos,id',
        ]);

        // Verificar unicidad del nombre dentro del módulo (excepto el actual)
        $exists = Permiso::where('nombre', $validated['nombre'])
                        ->where('modulo_id', $validated['modulo_id'])
                        ->where('id', '!=', $permiso->id)
                        ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Ya existe un permiso con este nombre en el módulo'
            ], 422);
        }

        $permiso->update($validated);

        return response()->json([
            'message' => 'Permiso actualizado exitosamente',
            'permiso' => [
                'id' => $permiso->id,
                'nombre' => $permiso->nombre,
                'descripcion' => $permiso->descripcion,
                'modulo_id' => $permiso->modulo_id,
            ]
        ]);
    }

    /**
     * Eliminar un permiso
     */
    public function destroy($id)
    {
        $permiso = Permiso::findOrFail($id);

        // Verificar si el permiso está asignado a roles
        if ($permiso->cantidadRoles() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar el permiso porque está asignado a roles'
            ], 422);
        }

        $permiso->delete();

        return response()->json([
            'message' => 'Permiso eliminado exitosamente'
        ]);
    }

    /**
     * Obtener permisos por módulo
     */
    public function getByModulo($moduloId)
    {
        $permisos = Permiso::where('modulo_id', $moduloId)
                          ->orderBy('nombre')
                          ->get()
                          ->map(function ($permiso) {
                              return [
                                  'id' => $permiso->id,
                                  'nombre' => $permiso->nombre,
                                  'descripcion' => $permiso->descripcion,
                                  'tipo' => $permiso->tipo(),
                              ];
                          });

        return response()->json($permisos);
    }

    /**
     * Obtener roles que tienen un permiso específico
     */
    public function getRoles($id)
    {
        $permiso = Permiso::findOrFail($id);

        $roles = DB::table('rol_permisos')
            ->join('roles', 'rol_permisos.rol_id', '=', 'roles.id')
            ->where('rol_permisos.permiso_id', $permiso->id)
            ->select('roles.id', 'roles.nombre', 'roles.descripcion')
            ->get();

        return response()->json($roles);
    }
}
