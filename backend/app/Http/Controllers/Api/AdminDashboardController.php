<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Rol;
use App\Models\Permiso;
use App\Models\Modulo;
use App\Models\Faena;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Obtener estadísticas generales del sistema
     */
    public function stats()
    {
        $stats = [
            'usuarios' => [
                'total' => User::count(),
                'activos' => User::where('estado', true)->count(),
                'inactivos' => User::where('estado', false)->count(),
                'administradores' => DB::table('usuario_roles')
                    ->join('roles', 'usuario_roles.rol_id', '=', 'roles.id')
                    ->where('roles.nombre', 'administrador')
                    ->distinct('usuario_roles.user_id')
                    ->count('usuario_roles.user_id'),
            ],
            'roles' => [
                'total' => Rol::count(),
                'activos' => Rol::where('estado', true)->count(),
            ],
            'permisos' => [
                'total' => Permiso::count(),
            ],
            'modulos' => [
                'total' => Modulo::count(),
                'activos' => Modulo::where('estado', true)->count(),
            ],
            'faenas' => [
                'total' => Faena::count(),
            ],
        ];

        return response()->json($stats);
    }

    /**
     * Obtener usuarios recientes
     */
    public function recentUsers()
    {
        $users = User::with('faena')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($user) {
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
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json($users);
    }

    /**
     * Obtener distribución de usuarios por faena
     */
    public function usersByFaena()
    {
        $distribution = DB::table('users')
            ->join('faenas', 'users.id_faena', '=', 'faenas.id')
            ->select('faenas.ubicacion', 'faenas.color', DB::raw('count(*) as total'))
            ->groupBy('faenas.id', 'faenas.ubicacion', 'faenas.color')
            ->orderBy('total', 'desc')
            ->get();

        return response()->json($distribution);
    }

    /**
     * Obtener roles más asignados
     */
    public function topRoles()
    {
        $roles = DB::table('usuario_roles')
            ->join('roles', 'usuario_roles.rol_id', '=', 'roles.id')
            ->select('roles.nombre', 'roles.descripcion', DB::raw('count(distinct usuario_roles.user_id) as usuarios'))
            ->groupBy('roles.id', 'roles.nombre', 'roles.descripcion')
            ->orderBy('usuarios', 'desc')
            ->limit(10)
            ->get();

        return response()->json($roles);
    }

    /**
     * Obtener actividad reciente del sistema
     */
    public function recentActivity()
    {
        // Usuarios creados recientemente
        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'type' => 'user_created',
                    'description' => "Usuario {$user->nombre} {$user->apellido} registrado",
                    'timestamp' => $user->created_at->format('Y-m-d H:i:s'),
                    'relative' => $user->created_at->diffForHumans(),
                ];
            });

        // Combinar y ordenar por fecha
        $activity = $recentUsers->sortByDesc('timestamp')->values();

        return response()->json($activity);
    }

    /**
     * Verificar si el usuario actual es administrador
     */
    public function checkAdmin()
    {
        $user = auth()->user();

        return response()->json([
            'is_admin' => $user->esAdministrador(),
            'user' => [
                'id' => $user->id,
                'nombre' => $user->nombre,
                'apellido' => $user->apellido,
                'email' => $user->email,
            ]
        ]);
    }
}
