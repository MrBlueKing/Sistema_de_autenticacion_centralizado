<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Permiso extends Model
{
    /**
     * Nombre de la tabla
     */
    protected $table = 'permisos'; // 👈 AGREGAR

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'modulo_id', // 👈 AGREGAR
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'modulo_id' => 'integer', // 👈 AGREGAR
    ];

    // ============================================
    // RELACIONES
    // ============================================

    /**
     * Un permiso pertenece a un módulo
     */
    public function modulo()
    {
        return $this->belongsTo(Modulo::class, 'modulo_id');
    }

    /**
     * Roles que tienen este permiso
     */
    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'rol_permisos', 'permiso_id', 'rol_id')
                    ->withTimestamps(); // 👈 AGREGAR
    }

    // ============================================
    // SCOPES (Consultas reutilizables)
    // ============================================

    /**
     * Scope para obtener permisos de un módulo específico
     *
     * @param Builder $query
     * @param int $moduloId
     * @return Builder
     */
    public function scopeDelModulo(Builder $query, $moduloId)
    {
        return $query->where('modulo_id', $moduloId);
    }

    /**
     * Scope para buscar permisos por nombre
     *
     * @param Builder $query
     * @param string $nombre
     * @return Builder
     */
    public function scopePorNombre(Builder $query, $nombre)
    {
        return $query->where('nombre', 'like', "%{$nombre}%");
    }

    /**
     * Scope para permisos de tipo específico (basado en prefijo)
     *
     * @param Builder $query
     * @param string $tipo (ver, crear, editar, eliminar)
     * @return Builder
     */
    public function scopePorTipo(Builder $query, $tipo)
    {
        return $query->where('nombre', 'like', "{$tipo}_%");
    }

    // ============================================
    // MÉTODOS HELPER
    // ============================================

    /**
     * Verificar si un rol específico tiene este permiso
     *
     * @param int $rolId
     * @return bool
     */
    public function tieneRol($rolId)
    {
        return $this->roles()->where('roles.id', $rolId)->exists();
    }

    /**
     * Verificar si algún rol tiene este permiso
     *
     * @return bool
     */
    public function estaAsignado()
    {
        return $this->roles()->exists();
    }

    /**
     * Contar cuántos roles tienen este permiso
     *
     * @return int
     */
    public function cantidadRoles()
    {
        return $this->roles()->count();
    }

    /**
     * Obtener usuarios que tienen este permiso (indirectamente a través de roles)
     *
     * @param int|null $moduloId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function usuarios($moduloId = null)
    {
        $query = User::whereHas('roles', function($q) {
            $q->whereHas('permisos', function($subQ) {
                $subQ->where('permisos.id', $this->id);
            });
        });

        if ($moduloId) {
            $query->whereHas('roles', function($q) use ($moduloId) {
                $q->wherePivot('modulo_id', $moduloId);
            });
        }

        return $query->get();
    }

    /**
     * Obtener nombres de roles que tienen este permiso
     *
     * @return \Illuminate\Support\Collection
     */
    public function nombresRoles()
    {
        return $this->roles->pluck('nombre');
    }

    /**
     * Asignar este permiso a múltiples roles
     *
     * @param array $rolesIds
     * @return void
     */
    public function asignarARoles(array $rolesIds)
    {
        $this->roles()->syncWithoutDetaching($rolesIds);
    }

    /**
     * Remover este permiso de múltiples roles
     *
     * @param array $rolesIds
     * @return void
     */
    public function removerDeRoles(array $rolesIds)
    {
        $this->roles()->detach($rolesIds);
    }

    /**
     * Sincronizar roles (reemplaza todos los roles que tienen este permiso)
     *
     * @param array $rolesIds
     * @return void
     */
    public function sincronizarRoles(array $rolesIds)
    {
        $this->roles()->sync($rolesIds);
    }

    /**
     * Verificar si es un permiso de lectura (ver)
     *
     * @return bool
     */
    public function esLectura()
    {
        return str_starts_with($this->nombre, 'ver_');
    }

    /**
     * Verificar si es un permiso de escritura (crear, editar, eliminar)
     *
     * @return bool
     */
    public function esEscritura()
    {
        return str_starts_with($this->nombre, 'crear_') 
            || str_starts_with($this->nombre, 'editar_')
            || str_starts_with($this->nombre, 'eliminar_');
    }

    /**
     * Obtener el tipo de permiso (ver, crear, editar, eliminar)
     *
     * @return string|null
     */
    public function tipo()
    {
        $tipos = ['ver', 'crear', 'editar', 'eliminar', 'exportar', 'importar'];
        
        foreach ($tipos as $tipo) {
            if (str_starts_with($this->nombre, $tipo . '_')) {
                return $tipo;
            }
        }
        
        return null;
    }

    /**
     * Obtener información completa del permiso
     *
     * @return array
     */
    public function resumen()
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'modulo' => $this->modulo?->nombre,
            'tipo' => $this->tipo(),
            'es_lectura' => $this->esLectura(),
            'es_escritura' => $this->esEscritura(),
            'cantidad_roles' => $this->cantidadRoles(),
            'roles' => $this->nombresRoles(),
        ];
    }
}