<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Faena extends Model
{
    /**
     * Nombre de la tabla
     */
    protected $table = 'faenas';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ubicacion',
        'color',
        'detalle',
        'estado',
        'porcentaje_tributacion',
        'fecha_creacion',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estado' => 'boolean',                // 👈 AGREGAR
        'fecha_creacion' => 'date',          // 👈 AGREGAR
        'porcentaje_tributacion' => 'decimal:2', // 👈 AGREGAR
    ];

    // ============================================
    // RELACIONES
    // ============================================

    /**
     * Una faena puede tener muchos usuarios
     */
    public function usuarios()
    {
        return $this->hasMany(User::class, 'id_faena');
    }

    // ============================================
    // SCOPES (Consultas reutilizables)
    // ============================================

    /**
     * Scope para obtener solo faenas activas
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeActivas(Builder $query)
    {
        return $query->where('estado', true);
    }

    /**
     * Scope para obtener faenas por ubicación
     *
     * @param Builder $query
     * @param string $ubicacion
     * @return Builder
     */
    public function scopePorUbicacion(Builder $query, $ubicacion)
    {
        return $query->where('ubicacion', 'like', "%{$ubicacion}%");
    }

    // ============================================
    // MÉTODOS HELPER
    // ============================================

    /**
     * Obtener usuarios activos de la faena
     */
    public function usuariosActivos()
    {
        return $this->usuarios()->where('estado', true)->get();
    }

    /**
     * Contar usuarios activos
     *
     * @return int
     */
    public function cantidadUsuariosActivos()
    {
        return $this->usuarios()->where('estado', true)->count();
    }

    /**
     * Contar total de usuarios
     *
     * @return int
     */
    public function cantidadUsuarios()
    {
        return $this->usuarios()->count();
    }

    /**
     * Verificar si la faena está activa
     *
     * @return bool
     */
    public function estaActiva()
    {
        return $this->estado === true;
    }

    /**
     * Activar faena
     *
     * @return bool
     */
    public function activar()
    {
        $this->estado = true;
        return $this->save();
    }

    /**
     * Desactivar faena
     *
     * @return bool
     */
    public function desactivar()
    {
        $this->estado = false;
        return $this->save();
    }

    /**
     * Obtener información resumida de la faena
     *
     * @return array
     */
    public function resumen()
    {
        return [
            'id' => $this->id,
            'ubicacion' => $this->ubicacion,
            'estado' => $this->estado,
            'total_usuarios' => $this->cantidadUsuarios(),
            'usuarios_activos' => $this->cantidadUsuariosActivos(),
            'porcentaje_tributacion' => $this->porcentaje_tributacion,
        ];
    }
}