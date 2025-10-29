<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Obtener el perfil completo del usuario autenticado
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $user->load(['faena', 'roles', 'modulos']);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'rut' => $user->rut,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
                'estado' => $user->estado,
                'created_at' => $user->created_at,
                'faena' => $user->faena ? [
                    'id' => $user->faena->id,
                    'ubicacion' => $user->faena->ubicacion,
                    'detalle' => $user->faena->detalle,
                ] : null,
            ]
        ], 200);
    }

    /**
     * Actualizar información básica del perfil
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:100',
            'apellido' => 'sometimes|required|string|max:100',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        // Actualizar solo los campos que vienen en la request
        $user->update($validated);

        // Recargar el usuario con sus relaciones
        $user->load(['faena', 'roles', 'modulos']);

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
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
                ] : null,
            ]
        ], 200);
    }

    /**
     * Cambiar contraseña del usuario
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ], [
            'current_password.required' => 'La contraseña actual es requerida',
            'new_password.required' => 'La nueva contraseña es requerida',
            'new_password.min' => 'La nueva contraseña debe tener al menos 8 caracteres',
            'new_password.confirmed' => 'Las contraseñas no coinciden',
        ]);

        // Verificar que la contraseña actual sea correcta
        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['La contraseña actual es incorrecta.'],
            ]);
        }

        // Verificar que la nueva contraseña sea diferente
        if (Hash::check($validated['new_password'], $user->password)) {
            throw ValidationException::withMessages([
                'new_password' => ['La nueva contraseña debe ser diferente a la actual.'],
            ]);
        }

        // Actualizar contraseña
        $user->password = Hash::make($validated['new_password']);
        $user->save();

        // Opcional: Revocar todos los tokens excepto el actual
        // Esto fuerza a cerrar sesión en otros dispositivos
        $currentToken = $request->user()->currentAccessToken();
        $user->tokens()->where('id', '!=', $currentToken->id)->delete();

        return response()->json([
            'message' => 'Contraseña actualizada exitosamente. Se han cerrado las sesiones en otros dispositivos.'
        ], 200);
    }

    /**
     * Obtener estadísticas del usuario (módulos, roles, etc.)
     */
    public function getStats(Request $request)
    {
        $user = $request->user();

        // Contar módulos únicos
        $totalModulos = $user->modulos()->count();

        // Contar roles únicos (puede tener el mismo rol en diferentes módulos)
        $totalRoles = $user->roles()->distinct('rol_id')->count();

        // Obtener el token actual para mostrar tiempo de expiración
        $currentToken = $request->user()->currentAccessToken();

        return response()->json([
            'stats' => [
                'total_modulos' => $totalModulos,
                'total_roles' => $totalRoles,
                'cuenta_activa_desde' => $user->created_at->format('Y-m-d'),
                'ultima_actualizacion' => $user->updated_at->format('Y-m-d H:i'),
                'token_expira_en' => $currentToken->expires_at 
                    ? $currentToken->expires_at->diffForHumans() 
                    : 'Sin expiración',
            ]
        ], 200);
    }
}