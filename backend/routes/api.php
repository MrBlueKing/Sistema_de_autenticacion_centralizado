<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Sistema Central de Autenticación
|--------------------------------------------------------------------------
*/

// ========================================
// 🔍 ENDPOINT DE PRUEBA (público)
// ========================================
Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API funcionando correctamente en SAC 🚀',
        'timestamp' => now()->toDateTimeString(),
    ]);
});

// ========================================
// 🔓 RUTAS PÚBLICAS (sin autenticación)
// ========================================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// ========================================
// 🔒 RUTAS PROTEGIDAS (solo auth:sanctum)
// ========================================
Route::middleware(['auth:sanctum', 'token.valid'])->group(function () {

    Route::get('/ping-token', function () {
        // 🐛 LOG: Este endpoint se ejecutó
        Log::info('🎯 ENDPOINT ping-token ejecutado', [
            'user_id' => request()->user()?->id,
            'timestamp' => now()->toDateTimeString(),
        ]);

        return response()->json([
            'status' => 'ok',
            'message' => 'Token válido ✅',
            'user' => request()->user()->only(['id', 'nombre', 'apellido']),
            'timestamp' => now()->toDateTimeString(),
        ]);
    });

    // --- Autenticación ---
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/user', [AuthController::class, 'user']);
    });

    // --- Módulos ---
    Route::prefix('modulos')->group(function () {
        Route::get('/', [AuthController::class, 'getModulos']);
        Route::get('/{moduloId}/permisos', [AuthController::class, 'getPermisosModulo']);
    });

    // --- Verificación de permisos ---
    Route::post('/verificar-permiso', [AuthController::class, 'verificarPermiso']);

    // Endpoint para que otros sistemas validen tokens
    Route::post('/validar-token', [AuthController::class, 'validarToken']);

    // --- Perfil de Usuario ---
    Route::prefix('user')->group(function () {
        Route::get('/profile', [\App\Http\Controllers\Api\UserController::class, 'getProfile']);
        Route::put('/profile', [\App\Http\Controllers\Api\UserController::class, 'updateProfile']);
        Route::put('/change-password', [\App\Http\Controllers\Api\UserController::class, 'changePassword']);
        Route::get('/stats', [\App\Http\Controllers\Api\UserController::class, 'getStats']);
    });
});
