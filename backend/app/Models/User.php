<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'rut',
        'nombre',
        'apellido',
        'email',
        'password',
        'estado',
        'id_faena',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'estado' => 'boolean',
        ];
    }

    // ============================================
    // RELACIONES ELOQUENT
    // ============================================

    /**
     * Un usuario pertenece a una faena
     */
    public function faena()
    {
        return $this->belongsTo(Faena::class, 'id_faena');
    }

    /**
     * Roles del usuario (con pivot modulo_id)
     */
    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'usuario_roles', 'user_id', 'rol_id')
                    ->withPivot('modulo_id')
                    ->withTimestamps();
    }

    /**
     * Módulos a los que el usuario tiene acceso
     * Esta es una relación Eloquent propiamente dicha
     */
    public function modulos()
    {
        return $this->belongsToMany(Modulo::class, 'usuario_roles', 'user_id', 'modulo_id')
                    ->distinct()
                    ->where('modulos.estado', true);
    }

    // ============================================
    // MÉTODOS HELPER
    // ============================================

    /**
     * Obtener roles del usuario en un módulo específico
     *
     * @param int $moduloId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function rolesEnModulo($moduloId)
    {
        return $this->roles()
                    ->wherePivot('modulo_id', $moduloId)
                    ->get();
    }

    /**
     * Verificar si el usuario tiene acceso a un módulo
     *
     * @param int $moduloId
     * @return bool
     */
    public function tieneAccesoAModulo($moduloId)
    {
        return $this->roles()
                    ->wherePivot('modulo_id', $moduloId)
                    ->exists();
    }

    /**
     * Obtener permisos del usuario en un módulo específico
     *
     * @param int $moduloId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function permisosEnModulo($moduloId)
    {
        // Obtener roles del usuario en ese módulo
        $roles = $this->rolesEnModulo($moduloId);
        
        if ($roles->isEmpty()) {
            return collect([]);
        }

        // Obtener permisos de esos roles
        $permisoIds = DB::table('rol_permisos')
            ->whereIn('rol_id', $roles->pluck('id'))
            ->distinct()
            ->pluck('permiso_id');

        return Permiso::whereIn('id', $permisoIds)
                      ->where('modulo_id', $moduloId)
                      ->get();
    }

    /**
     * Verificar si el usuario tiene un permiso específico en un módulo
     *
     * @param string $nombrePermiso
     * @param int $moduloId
     * @return bool
     */
    public function tienePermiso($nombrePermiso, $moduloId)
    {
        $permisos = $this->permisosEnModulo($moduloId);
        
        return $permisos->contains('nombre', $nombrePermiso);
    }

    /**
     * Verificar si el usuario tiene un rol específico en un módulo
     *
     * @param string $nombreRol
     * @param int $moduloId
     * @return bool
     */
    public function tieneRol($nombreRol, $moduloId)
    {
        $roles = $this->rolesEnModulo($moduloId);
        
        return $roles->contains('nombre', $nombreRol);
    }

    /**
     * Obtener información completa del usuario para un módulo
     *
     * @param int $moduloId
     * @return array
     */
    public function infoCompleta($moduloId)
    {
        return [
            'user' => $this->only(['id', 'rut', 'nombre', 'apellido', 'email']),
            'faena' => $this->faena,
            'roles' => $this->rolesEnModulo($moduloId),
            'permisos' => $this->permisosEnModulo($moduloId)->pluck('nombre'),
        ];
    }

    /**
     * Obtener todos los módulos activos (método helper sin eager loading)
     * Útil cuando no necesitas eager loading
     */
    public function getModulosActivos()
    {
        return $this->modulos()->where('modulos.estado', true)->get();
    }

    /**
     * Verificar si el usuario es administrador
     * Un usuario es administrador si tiene el rol 'administrador' en cualquier módulo
     *
     * @return bool
     */
    public function esAdministrador()
    {
        return $this->roles()
                    ->where('roles.nombre', 'administrador')
                    ->exists();
    }

    /**
     * Verificar si el usuario tiene el rol de administrador en un módulo específico
     *
     * @param int|null $moduloId
     * @return bool
     */
    public function esAdministradorEnModulo($moduloId = null)
    {
        if ($moduloId === null) {
            return $this->esAdministrador();
        }

        return $this->tieneRol('administrador', $moduloId);
    }
}