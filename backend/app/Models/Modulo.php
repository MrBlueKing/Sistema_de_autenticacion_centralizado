<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class Modulo extends Model
{
    /**
     * Nombre de la tabla
     */
    protected $table = 'modulos'; // 👈 AGREGAR

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'url',      // 👈 AGREGAR
        'icono',    // 👈 AGREGAR
        'estado',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estado' => 'boolean', // 👈 AGREGAR
    ];

    // ============================================
    // RELACIONES
    // ============================================

    /**
     * Permisos específicos de este módulo
     */
    public function permisos()
    {
        return $this->hasMany(Permiso::class, 'modulo_id');
    }

    // ============================================
    // SCOPES (Consultas reutilizables)
    // ============================================

    /**
     * Scope para obtener solo módulos activos
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeActivos(Builder $query)
    {
        return $query->where('estado', true);
    }

    /**
     * Scope para buscar por nombre
     *
     * @param Builder $query
     * @param string $nombre
     * @return Builder
     */
    public function scopePorNombre(Builder $query, $nombre)
    {
        return $query->where('nombre', 'like', "%{$nombre}%");
    }

    // ============================================
    // MÉTODOS HELPER
    // ============================================

    /**
     * Obtener usuarios que tienen acceso a este módulo
     * (a través de usuario_roles)
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function usuarios()
    {
        $userIds = DB::table('usuario_roles')
            ->where('modulo_id', $this->id)
            ->distinct()
            ->pluck('user_id');

        return User::whereIn('id', $userIds)
                   ->where('estado', true)
                   ->get();
    }

    /**
     * Obtener todos los usuarios (activos e inactivos) con acceso
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function todosUsuarios()
    {
        $userIds = DB::table('usuario_roles')
            ->where('modulo_id', $this->id)
            ->distinct()
            ->pluck('user_id');

        return User::whereIn('id', $userIds)->get();
    }

    /**
     * Verificar si un usuario tiene acceso a este módulo
     *
     * @param int $userId
     * @return bool
     */
    public function tieneUsuario($userId)
    {
        return DB::table('usuario_roles')
            ->where('modulo_id', $this->id)
            ->where('user_id', $userId)
            ->exists();
    }

    /**
     * Contar usuarios activos con acceso al módulo
     *
     * @return int
     */
    public function cantidadUsuarios()
    {
        $userIds = DB::table('usuario_roles')
            ->where('modulo_id', $this->id)
            ->distinct()
            ->pluck('user_id');

        return User::whereIn('id', $userIds)
                   ->where('estado', true)
                   ->count();
    }

    /**
     * Obtener roles asignados en este módulo
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function rolesAsignados()
    {
        $rolIds = DB::table('usuario_roles')
            ->where('modulo_id', $this->id)
            ->distinct()
            ->pluck('rol_id');

        return Rol::whereIn('id', $rolIds)->get();
    }

    /**
     * Contar permisos del módulo
     *
     * @return int
     */
    public function cantidadPermisos()
    {
        return $this->permisos()->count();
    }

    /**
     * Obtener permisos agrupados por tipo
     *
     * @return \Illuminate\Support\Collection
     */
    public function permisosPorTipo()
    {
        return $this->permisos()
                    ->get()
                    ->groupBy(function($permiso) {
                        return $permiso->tipo() ?? 'otros';
                    });
    }

    /**
     * Verificar si el módulo está activo
     *
     * @return bool
     */
    public function estaActivo()
    {
        return $this->estado === true;
    }

    /**
     * Activar módulo
     *
     * @return bool
     */
    public function activar()
    {
        $this->estado = true;
        return $this->save();
    }

    /**
     * Desactivar módulo
     *
     * @return bool
     */
    public function desactivar()
    {
        $this->estado = false;
        return $this->save();
    }

    /**
     * Obtener asignaciones completas (usuarios con sus roles en este módulo)
     *
     * @return \Illuminate\Support\Collection
     */
    public function asignaciones()
    {
        $asignaciones = DB::table('usuario_roles')
            ->join('users', 'usuario_roles.user_id', '=', 'users.id')
            ->join('roles', 'usuario_roles.rol_id', '=', 'roles.id')
            ->where('usuario_roles.modulo_id', $this->id)
            ->select(
                'users.id as user_id',
                'users.nombre',
                'users.apellido',
                'users.rut',
                'roles.id as rol_id',
                'roles.nombre as rol_nombre'
            )
            ->get();

        return $asignaciones;
    }

    /**
     * Obtener estadísticas del módulo
     *
     * @return array
     */
    public function estadisticas()
    {
        return [
            'usuarios_activos' => $this->cantidadUsuarios(),
            'total_permisos' => $this->cantidadPermisos(),
            'roles_asignados' => $this->rolesAsignados()->count(),
            'permisos_por_tipo' => $this->permisosPorTipo()->map->count(),
        ];
    }

    /**
     * Obtener información completa del módulo
     *
     * @return array
     */
    public function resumen()
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'url' => $this->url,
            'icono' => $this->icono,
            'estado' => $this->estado,
            'usuarios_activos' => $this->cantidadUsuarios(),
            'permisos' => $this->cantidadPermisos(),
            'roles' => $this->rolesAsignados()->pluck('nombre'),
        ];
    }

    /**
     * Información para dashboard (formato para frontend)
     *
     * @return array
     */
    public function paraDashboard()
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'url' => $this->url,
            'icono' => $this->icono,
            'activo' => $this->estado,
        ];
    }
}