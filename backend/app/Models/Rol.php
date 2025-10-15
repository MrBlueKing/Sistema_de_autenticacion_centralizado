<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Rol extends Model
{
    /**
     * Nombre de la tabla
     */
    protected $table = 'roles'; // 👈 AGREGAR

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    // ============================================
    // RELACIONES
    // ============================================

    /**
     * Usuarios que tienen este rol (en diferentes módulos)
     */
    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'usuario_roles', 'rol_id', 'user_id')
                    ->withPivot('modulo_id') // 👈 IMPORTANTE
                    ->withTimestamps();
    }

    /**
     * Permisos asociados a este rol
     */
    public function permisos()
    {
        return $this->belongsToMany(Permiso::class, 'rol_permisos', 'rol_id', 'permiso_id')
                    ->withTimestamps();
    }

    // ============================================
    // SCOPES (Consultas reutilizables)
    // ============================================

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
     * Verificar si el rol tiene un permiso específico
     *
     * @param string $nombrePermiso
     * @return bool
     */
    public function tienePermiso($nombrePermiso)
    {
        return $this->permisos()->where('nombre', $nombrePermiso)->exists();
    }

    /**
     * Verificar si el rol tiene alguno de los permisos
     *
     * @param array $nombresPermisos
     * @return bool
     */
    public function tieneAlgunPermiso(array $nombresPermisos)
    {
        return $this->permisos()->whereIn('nombre', $nombresPermisos)->exists();
    }

    /**
     * Verificar si el rol tiene todos los permisos
     *
     * @param array $nombresPermisos
     * @return bool
     */
    public function tieneTodosPermisos(array $nombresPermisos)
    {
        $count = $this->permisos()->whereIn('nombre', $nombresPermisos)->count();
        return $count === count($nombresPermisos);
    }

    /**
     * Asignar múltiples permisos al rol
     *
     * @param array $permisoIds
     * @return void
     */
    public function asignarPermisos(array $permisoIds)
    {
        $this->permisos()->syncWithoutDetaching($permisoIds);
    }

    /**
     * Remover múltiples permisos del rol
     *
     * @param array $permisoIds
     * @return void
     */
    public function removerPermisos(array $permisoIds)
    {
        $this->permisos()->detach($permisoIds);
    }

    /**
     * Sincronizar permisos (reemplaza todos los permisos existentes)
     *
     * @param array $permisoIds
     * @return void
     */
    public function sincronizarPermisos(array $permisoIds)
    {
        $this->permisos()->sync($permisoIds);
    }

    /**
     * Obtener nombres de todos los permisos
     *
     * @return \Illuminate\Support\Collection
     */
    public function nombresPermisos()
    {
        return $this->permisos->pluck('nombre');
    }

    /**
     * Contar permisos del rol
     *
     * @return int
     */
    public function cantidadPermisos()
    {
        return $this->permisos()->count();
    }

    /**
     * Obtener usuarios con este rol en un módulo específico
     *
     * @param int $moduloId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function usuariosEnModulo($moduloId)
    {
        return $this->usuarios()->wherePivot('modulo_id', $moduloId)->get();
    }

    /**
     * Contar usuarios con este rol
     *
     * @return int
     */
    public function cantidadUsuarios()
    {
        return $this->usuarios()->count();
    }

    /**
     * Contar usuarios con este rol en un módulo específico
     *
     * @param int $moduloId
     * @return int
     */
    public function cantidadUsuariosEnModulo($moduloId)
    {
        return $this->usuarios()->wherePivot('modulo_id', $moduloId)->count();
    }

    /**
     * Obtener permisos agrupados por módulo
     *
     * @return \Illuminate\Support\Collection
     */
    public function permisosPorModulo()
    {
        return $this->permisos()
                    ->with('modulo')
                    ->get()
                    ->groupBy('modulo.nombre');
    }

    /**
     * Obtener información completa del rol
     *
     * @return array
     */
    public function resumen()
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'cantidad_permisos' => $this->cantidadPermisos(),
            'cantidad_usuarios' => $this->cantidadUsuarios(),
            'permisos' => $this->nombresPermisos(),
        ];
    }
}