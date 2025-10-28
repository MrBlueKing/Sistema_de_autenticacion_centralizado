<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Modulo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login - Autenticar usuario y generar token
     */
    public function login(Request $request)
    {
        $request->validate([
            'rut' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('rut', $request->rut)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'rut' => ['Las credenciales son incorrectas.'],
            ]);
        }

        if (!$user->estado) {
            throw ValidationException::withMessages([
                'rut' => ['Tu cuenta está desactivada. Contacta al administrador.'],
            ]);
        }

        // ✅ OPCIÓN B: Eliminar solo tokens EXPIRADOS
        // (Permite múltiples sesiones activas)
        $user->tokens()->where('expires_at', '<', now())->delete();

        // 🔑 Crear token
        $tokenResult = $user->createToken('auth_token');
        $plainTextToken = $tokenResult->plainTextToken;

        // ⏱️ ⚠️ CRÍTICO: Forzar expiración manualmente
        // Sanctum NO hace esto automáticamente aunque tengas la config
        $tokenModel = $tokenResult->accessToken;
        $expirationMinutes = config('sanctum.expiration'); // Lee de .env

        if ($expirationMinutes !== null) {
            $tokenModel->expires_at = now()->addMinutes($expirationMinutes);
            $tokenModel->save(); // ⚠️ IMPORTANTE: Guardar explícitamente
        }

        // 🐛 DEBUG: Verificar que se guardó
        $tokenModel->refresh(); // Recargar desde BD
        Log::info('🔑 Token creado y guardado:', [
            'token_id' => $tokenModel->id,
            'expires_at' => $tokenModel->expires_at,
            'expires_at_formatted' => $tokenModel->expires_at?->toDateTimeString(),
            'created_at' => $tokenModel->created_at,
            'expiration_config' => config('sanctum.expiration'),
        ]);

        // Cargar relaciones
        $user->load(['faena', 'roles', 'modulos']);

        return response()->json([
            'message' => 'Login exitoso',
            'user' => [
                'id' => $user->id,
                'rut' => $user->rut,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
                'faena' => $user->faena ? [
                    'id' => $user->faena->id,
                    'ubicacion' => $user->faena->ubicacion,
                ] : null,
            ],
            'token' => $plainTextToken,
            'token_type' => 'Bearer',
            'expires_in_minutes' => $expirationMinutes, // 👈 Opcional: informar al frontend
        ], 200);
    }

    /**
     * Logout - Revocar token actual
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout exitoso'
        ], 200);
    }

    /**
     * Obtener información del usuario autenticado
     */
    public function user(Request $request)
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
                'faena' => $user->faena ? [
                    'id' => $user->faena->id,
                    'ubicacion' => $user->faena->ubicacion,
                ] : null,
            ]
        ], 200);
    }

    /**
     * Obtener módulos disponibles para el usuario autenticado
     */
    public function getModulos(Request $request)
    {
        $user = $request->user();

        $modulos = $user->modulos()->where('modulos.estado', true)->get()->map(function ($modulo) use ($user) {
            return [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
                'descripcion' => $modulo->descripcion,
                'url' => $modulo->url,
                'roles' => $user->rolesEnModulo($modulo->id)->pluck('nombre'),
                'permisos' => $user->permisosEnModulo($modulo->id)->pluck('nombre'),
            ];
        });

        return response()->json([
            'modulos' => $modulos
        ], 200);
    }

    /**
     * Obtener permisos del usuario en un módulo específico
     */
    public function getPermisosModulo(Request $request, $moduloId)
    {
        $user = $request->user();

        // Verificar acceso al módulo
        if (!$user->tieneAccesoAModulo($moduloId)) {
            return response()->json([
                'message' => 'No tienes acceso a este módulo'
            ], 403);
        }

        $modulo = Modulo::findOrFail($moduloId);

        return response()->json([
            'modulo' => [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
            ],
            'roles' => $user->rolesEnModulo($moduloId)->pluck('nombre'),
            'permisos' => $user->permisosEnModulo($moduloId)->pluck('nombre'),
        ], 200);
    }

    /**
     * Refresh - Generar nuevo token
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Eliminar token actual
        $request->user()->currentAccessToken()->delete();

        // Crear nuevo token (con nueva expiración automática)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Token renovado exitosamente',
            'token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }

    /**
     * Verificar si el usuario tiene un permiso específico en un módulo
     */
    public function verificarPermiso(Request $request)
    {
        $request->validate([
            'permiso' => 'required|string',
            'modulo_id' => 'required|integer|exists:modulos,id',
        ]);

        $user = $request->user();
        $tienePermiso = $user->tienePermiso($request->permiso, $request->modulo_id);

        return response()->json([
            'tiene_permiso' => $tienePermiso
        ], 200);
    }

    /**
     * Validar token para módulos externos
     */
    public function validarToken(Request $request)
    {
        $request->validate([
            'modulo_id' => 'required|integer|exists:modulos,id',
        ]);

        $user = $request->user();

        // Verificar acceso al módulo
        if (!$user->tieneAccesoAModulo($request->modulo_id)) {
            return response()->json([
                'valid' => false,
                'message' => 'No tienes acceso a este módulo'
            ], 403);
        }

        // Obtener roles y permisos del usuario en este módulo
        $roles = $user->rolesEnModulo($request->modulo_id);
        $permisos = $user->permisosEnModulo($request->modulo_id);

        return response()->json([
            'valid' => true,
            'user' => [
                'id' => $user->id,
                'rut' => $user->rut,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
                'faena' => $user->faena ? [
                    'id' => $user->faena->id,
                    'ubicacion' => $user->faena->ubicacion,
                ] : null,
            ],
            'roles' => $roles->pluck('nombre'),
            'permisos' => $permisos->pluck('nombre'),
        ], 200);
    }
}
