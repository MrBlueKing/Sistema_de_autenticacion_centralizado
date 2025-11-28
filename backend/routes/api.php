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

    // --- Faenas ---
    Route::prefix('faenas')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\FaenaController::class, 'index']);
        Route::get('/{id}', [\App\Http\Controllers\Api\FaenaController::class, 'show']);
    });
});

// ========================================
// 👑 RUTAS DE ADMINISTRACIÓN (requiere rol administrador)
// ========================================
Route::middleware(['auth:sanctum', 'token.valid', 'admin'])->prefix('admin')->group(function () {

    // --- Dashboard de Administración ---
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\Api\AdminDashboardController::class, 'stats']);
        Route::get('/recent-users', [\App\Http\Controllers\Api\AdminDashboardController::class, 'recentUsers']);
        Route::get('/users-by-faena', [\App\Http\Controllers\Api\AdminDashboardController::class, 'usersByFaena']);
        Route::get('/top-roles', [\App\Http\Controllers\Api\AdminDashboardController::class, 'topRoles']);
        Route::get('/recent-activity', [\App\Http\Controllers\Api\AdminDashboardController::class, 'recentActivity']);
        Route::get('/check-admin', [\App\Http\Controllers\Api\AdminDashboardController::class, 'checkAdmin']);
    });

    // --- Gestión de Usuarios ---
    Route::prefix('users')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\UserManagementController::class, 'index']);
        Route::get('/{id}', [\App\Http\Controllers\Api\UserManagementController::class, 'show']);
        Route::post('/', [\App\Http\Controllers\Api\UserManagementController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\UserManagementController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\UserManagementController::class, 'destroy']);
        Route::patch('/{id}/toggle-status', [\App\Http\Controllers\Api\UserManagementController::class, 'toggleStatus']);
        Route::post('/{id}/assign-roles', [\App\Http\Controllers\Api\UserManagementController::class, 'assignRoles']);
        Route::delete('/{id}/remove-role', [\App\Http\Controllers\Api\UserManagementController::class, 'removeRole']);
        Route::get('/{id}/roles', [\App\Http\Controllers\Api\UserManagementController::class, 'getUserRoles']);
    });

    // --- Gestión de Roles ---
    Route::prefix('roles')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\RoleManagementController::class, 'index']);
        Route::get('/{id}', [\App\Http\Controllers\Api\RoleManagementController::class, 'show']);
        Route::post('/', [\App\Http\Controllers\Api\RoleManagementController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\RoleManagementController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\RoleManagementController::class, 'destroy']);
        Route::patch('/{id}/toggle-status', [\App\Http\Controllers\Api\RoleManagementController::class, 'toggleStatus']);
        Route::post('/{id}/assign-permisos', [\App\Http\Controllers\Api\RoleManagementController::class, 'assignPermisos']);
        Route::get('/{id}/permisos', [\App\Http\Controllers\Api\RoleManagementController::class, 'getPermisos']);
        Route::get('/{id}/usuarios', [\App\Http\Controllers\Api\RoleManagementController::class, 'getUsuarios']);
    });

    // --- Gestión de Permisos ---
    Route::prefix('permisos')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\PermissionController::class, 'index']);
        Route::get('/{id}', [\App\Http\Controllers\Api\PermissionController::class, 'show']);
        Route::post('/', [\App\Http\Controllers\Api\PermissionController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\PermissionController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\PermissionController::class, 'destroy']);
        Route::get('/modulo/{moduloId}', [\App\Http\Controllers\Api\PermissionController::class, 'getByModulo']);
        Route::get('/{id}/roles', [\App\Http\Controllers\Api\PermissionController::class, 'getRoles']);
    });

    // --- Gestión de Módulos ---
    Route::prefix('modulos')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\ModuleController::class, 'index']);
        Route::get('/{id}', [\App\Http\Controllers\Api\ModuleController::class, 'show']);
        Route::post('/', [\App\Http\Controllers\Api\ModuleController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\ModuleController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\ModuleController::class, 'destroy']);
        Route::patch('/{id}/toggle-status', [\App\Http\Controllers\Api\ModuleController::class, 'toggleStatus']);
        Route::get('/{id}/stats', [\App\Http\Controllers\Api\ModuleController::class, 'getStats']);
        Route::get('/{id}/usuarios', [\App\Http\Controllers\Api\ModuleController::class, 'getUsuarios']);
        Route::get('/{id}/roles', [\App\Http\Controllers\Api\ModuleController::class, 'getRoles']);
    });

    // --- Gestión de Faenas ---
    Route::prefix('faenas')->group(function () {
        Route::post('/', [\App\Http\Controllers\Api\FaenaController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\FaenaController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\FaenaController::class, 'destroy']);
        Route::patch('/{id}/toggle-status', [\App\Http\Controllers\Api\FaenaController::class, 'toggleStatus']);
    });
});
