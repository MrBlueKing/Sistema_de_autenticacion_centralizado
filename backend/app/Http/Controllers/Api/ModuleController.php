<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Modulo;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ModuleController extends Controller
{
    /**
     * Listar todos los módulos con paginación y filtros
     */
    public function index(Request $request)
    {
        $query = Modulo::query();

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

        // Sin paginación si se solicita todos
        if ($request->get('all')) {
            $modulos = $query->get()->map(function ($modulo) {
                return [
                    'id' => $modulo->id,
                    'nombre' => $modulo->nombre,
                    'descripcion' => $modulo->descripcion,
                    'url' => $modulo->url,
                    'icono' => $modulo->icono,
                    'estado' => $modulo->estado,
                    'cantidad_usuarios' => $modulo->cantidadUsuarios(),
                    'cantidad_permisos' => $modulo->permisos()->count(),
                    'created_at' => $modulo->created_at ? $modulo->created_at->format('Y-m-d H:i:s') : null,
                ];
            });

            return response()->json($modulos);
        }

        // Con paginación
        $perPage = $request->get('per_page', 15);
        $modulos = $query->paginate($perPage);

        // Transformar datos
        $modulos->getCollection()->transform(function ($modulo) {
            return [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
                'descripcion' => $modulo->descripcion,
                'url' => $modulo->url,
                'icono' => $modulo->icono,
                'estado' => $modulo->estado,
                'cantidad_usuarios' => $modulo->cantidadUsuarios(),
                'cantidad_permisos' => $modulo->permisos()->count(),
                'created_at' => $modulo->created_at ? $modulo->created_at->format('Y-m-d H:i:s') : null,
                'updated_at' => $modulo->updated_at ? $modulo->updated_at->format('Y-m-d H:i:s') : null,
            ];
        });

        return response()->json($modulos);
    }

    /**
     * Obtener un módulo específico
     */
    public function show($id)
    {
        $modulo = Modulo::with('permisos')->findOrFail($id);

        $estadisticas = $modulo->estadisticas();

        return response()->json([
            'id' => $modulo->id,
            'nombre' => $modulo->nombre,
            'descripcion' => $modulo->descripcion,
            'url' => $modulo->url,
            'icono' => $modulo->icono,
            'estado' => $modulo->estado,
            'estadisticas' => $estadisticas,
            'permisos' => $modulo->permisos->map(function ($permiso) {
                return [
                    'id' => $permiso->id,
                    'nombre' => $permiso->nombre,
                    'descripcion' => $permiso->descripcion,
                ];
            }),
            'created_at' => $modulo->created_at ? $modulo->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $modulo->updated_at ? $modulo->updated_at->format('Y-m-d H:i:s') : null,
        ]);
    }

    /**
     * Crear un nuevo módulo
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|unique:modulos,nombre|max:255',
            'descripcion' => 'nullable|string',
            'url' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:100',
            'estado' => 'boolean',
        ]);

        $validated['estado'] = $request->get('estado', true);

        $modulo = Modulo::create($validated);

        return response()->json([
            'message' => 'Módulo creado exitosamente',
            'modulo' => [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
                'descripcion' => $modulo->descripcion,
                'url' => $modulo->url,
                'icono' => $modulo->icono,
                'estado' => $modulo->estado,
            ]
        ], 201);
    }

    /**
     * Actualizar un módulo existente
     */
    public function update(Request $request, $id)
    {
        $modulo = Modulo::findOrFail($id);

        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', Rule::unique('modulos')->ignore($modulo->id)],
            'descripcion' => 'nullable|string',
            'url' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:100',
            'estado' => 'boolean',
        ]);

        $modulo->update($validated);

        return response()->json([
            'message' => 'Módulo actualizado exitosamente',
            'modulo' => [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
                'descripcion' => $modulo->descripcion,
                'url' => $modulo->url,
                'icono' => $modulo->icono,
                'estado' => $modulo->estado,
            ]
        ]);
    }

    /**
     * Eliminar un módulo
     */
    public function destroy($id)
    {
        $modulo = Modulo::findOrFail($id);

        // Verificar si el módulo tiene usuarios asignados
        if ($modulo->cantidadUsuarios() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar el módulo porque tiene usuarios asignados'
            ], 422);
        }

        // Verificar si el módulo tiene permisos
        if ($modulo->permisos()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar el módulo porque tiene permisos asociados. Elimina los permisos primero.'
            ], 422);
        }

        $modulo->delete();

        return response()->json([
            'message' => 'Módulo eliminado exitosamente'
        ]);
    }

    /**
     * Cambiar el estado de un módulo (activar/desactivar)
     */
    public function toggleStatus($id)
    {
        $modulo = Modulo::findOrFail($id);

        $modulo->estado = !$modulo->estado;
        $modulo->save();

        return response()->json([
            'message' => $modulo->estado ? 'Módulo activado' : 'Módulo desactivado',
            'estado' => $modulo->estado
        ]);
    }

    /**
     * Obtener estadísticas de un módulo
     */
    public function getStats($id)
    {
        $modulo = Modulo::findOrFail($id);
        $estadisticas = $modulo->estadisticas();

        return response()->json($estadisticas);
    }

    /**
     * Obtener usuarios asignados a un módulo
     */
    public function getUsuarios($id)
    {
        $modulo = Modulo::findOrFail($id);
        $usuarios = $modulo->usuarios();

        return response()->json($usuarios);
    }

    /**
     * Obtener roles asignados en un módulo
     */
    public function getRoles($id)
    {
        $modulo = Modulo::findOrFail($id);
        $roles = $modulo->rolesAsignados();

        return response()->json($roles);
    }
}
