<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // ✅ Alias del middleware
        $middleware->alias([
            'token.valid' => \App\Http\Middleware\EnsureTokenIsValid::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        
        // ✅ Sobrescribir el comportamiento de AuthenticationException
        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            
            // Para requests que esperan JSON (APIs)
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                    'error' => 'unauthenticated'
                ], 401);
            }
            
            // Para requests web, dejar que Laravel maneje (redirect a login)
            return null;
        });

        // ✅ Manejar otras excepciones para APIs
        $exceptions->render(function (Request $request, Throwable $exception) {
            
            // Solo para APIs
            if ($request->expectsJson() || $request->is('api/*')) {
                
                // Errores de validación
                if ($exception instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'message' => 'Error de validación',
                        'errors' => $exception->errors()
                    ], 422);
                }

                // Modelo no encontrado
                if ($exception instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                    return response()->json([
                        'message' => 'Recurso no encontrado'
                    ], 404);
                }

                // Sin autorización
                if ($exception instanceof \Illuminate\Auth\Access\AuthorizationException) {
                    return response()->json([
                        'message' => 'No tienes permisos para realizar esta acción'
                    ], 403);
                }

                // Excepciones HTTP (404, 403, etc.)
                if ($exception instanceof HttpException) {
                    return response()->json([
                        'message' => $exception->getMessage() ?: 'Error en la solicitud',
                    ], $exception->getStatusCode());
                }

                // Cualquier otra excepción
                return response()->json([
                    'message' => config('app.debug') 
                        ? $exception->getMessage() 
                        : 'Error interno del servidor',
                    'error' => config('app.debug') ? get_class($exception) : 'server_error',
                ], 500);
            }

            return null; // Default para rutas web
        });
    })
    ->create();