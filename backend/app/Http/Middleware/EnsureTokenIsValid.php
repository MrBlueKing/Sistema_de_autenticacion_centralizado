<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('🔐 EnsureTokenIsValid EJECUTÁNDOSE', [
            'timestamp' => now()->toDateTimeString(),
        ]);

        $user = $request->user();

        Log::info('🔐 Usuario obtenido', [
            'has_user' => !is_null($user),
            'user_id' => $user?->id,
        ]);

        if ($user) {
            $token = $user->currentAccessToken();

            if ($token) {
                $isExpired = $token->expires_at && now()->greaterThan($token->expires_at);

                Log::info('🎫 Token verificado', [
                    'token_id' => $token->id,
                    'expires_at' => $token->expires_at?->toDateTimeString(),
                    'now' => now()->toDateTimeString(),
                    'is_expired' => $isExpired,
                ]);

                if ($isExpired) {
                    Log::warning('⚠️ Token EXPIRADO - eliminando');
                    $token->delete();
                    Log::info('🎫 Token verificado Y ELiminado', [
                        'token_id' => $token->id,
                        'expires_at' => $token->expires_at?->toDateTimeString(),
                        'now' => now()->toDateTimeString(),
                        'is_expired' => $isExpired,
                    ]);

                    return response()->json([
                        'message' => 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        'error' => 'token_expired'
                    ], 401);
                }
            }
        }

        Log::info('✅ Middleware completado, continuando request');
        return $next($request);
    }
}
