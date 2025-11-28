<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faena;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaenaController extends Controller
{
    /**
     * Obtener todas las faenas
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Obtener parámetros opcionales
            $soloActivas = $request->query('activas', false);
            $conUsuarios = $request->query('con_usuarios', false);

            // Query base
            $query = Faena::query();

            // Filtrar por activas si se solicita
            if ($soloActivas) {
                $query->activas();
            }

            // Incluir conteo de usuarios si se solicita
            if ($conUsuarios) {
                $query->withCount('usuarios');
            }

            // Ordenar por ubicación
            $faenas = $query->orderBy('ubicacion', 'asc')->get();

            // Si se solicita incluir usuarios, añadir el conteo de usuarios activos
            if ($conUsuarios) {
                $faenas->each(function ($faena) {
                    $faena->usuarios_activos_count = $faena->cantidadUsuariosActivos();
                });
            }

            return response()->json([
                'success' => true,
                'data' => $faenas,
                'total' => $faenas->count(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las faenas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener una faena específica
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $faena = Faena::with('usuarios')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $faena->id,
                    'ubicacion' => $faena->ubicacion,
                    'color' => $faena->color,
                    'detalle' => $faena->detalle,
                    'estado' => $faena->estado,
                    'porcentaje_tributacion' => $faena->porcentaje_tributacion,
                    'fecha_creacion' => $faena->fecha_creacion,
                    'total_usuarios' => $faena->cantidadUsuarios(),
                    'usuarios_activos' => $faena->cantidadUsuariosActivos(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Faena no encontrada',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Crear una nueva faena
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ubicacion' => 'required|string|unique:faenas,ubicacion|max:255',
                'color' => 'nullable|string|max:7', // Formato hexadecimal #RRGGBB
                'detalle' => 'nullable|string',
                'estado' => 'boolean',
                'porcentaje_tributacion' => 'nullable|numeric|min:0|max:100',
                'fecha_creacion' => 'nullable|date',
            ]);

            $validated['estado'] = $request->get('estado', true);

            $faena = Faena::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Faena creada exitosamente',
                'data' => $faena,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la faena',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar una faena existente
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $faena = Faena::findOrFail($id);

            $validated = $request->validate([
                'ubicacion' => 'required|string|max:255|unique:faenas,ubicacion,' . $id,
                'color' => 'nullable|string|max:7',
                'detalle' => 'nullable|string',
                'estado' => 'boolean',
                'porcentaje_tributacion' => 'nullable|numeric|min:0|max:100',
                'fecha_creacion' => 'nullable|date',
            ]);

            $faena->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Faena actualizada exitosamente',
                'data' => $faena,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la faena',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar una faena
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $faena = Faena::findOrFail($id);

            // Verificar si la faena tiene usuarios asignados
            if ($faena->cantidadUsuarios() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la faena porque tiene usuarios asignados',
                ], 422);
            }

            $faena->delete();

            return response()->json([
                'success' => true,
                'message' => 'Faena eliminada exitosamente',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la faena',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cambiar el estado de una faena
     *
     * @param int $id
     * @return JsonResponse
     */
    public function toggleStatus(int $id): JsonResponse
    {
        try {
            $faena = Faena::findOrFail($id);

            $faena->estado = !$faena->estado;
            $faena->save();

            return response()->json([
                'success' => true,
                'message' => $faena->estado ? 'Faena activada' : 'Faena desactivada',
                'estado' => $faena->estado,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar el estado de la faena',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
