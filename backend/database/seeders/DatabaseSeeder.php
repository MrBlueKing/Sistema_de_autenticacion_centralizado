<?php

namespace Database\Seeders;

use App\Models\Faena;
use App\Models\Modulo;
use App\Models\Permiso;
use App\Models\Rol;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear Faenas
        $faena1 = Faena::create([
            'ubicacion' => 'Región Metropolitana',
            'detalle' => 'Faena principal de operaciones',
            'estado' => true,
            'porcentaje_tributacion' => 15.50,
            'fecha_creacion' => now(),
        ]);

        $faena2 = Faena::create([
            'ubicacion' => 'Antofagasta',
            'detalle' => 'Operaciones zona norte',
            'estado' => true,
            'porcentaje_tributacion' => 12.00,
            'fecha_creacion' => now(),
        ]);

        // 2. Crear Usuarios
        $admin = User::create([
            'rut' => '12345678-9',
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'admin@sistema.com',
            'password' => Hash::make('password123'),
            'estado' => true,
            'id_faena' => $faena1->id,
        ]);

        $operario = User::create([
            'rut' => '98765432-1',
            'nombre' => 'María',
            'apellido' => 'González',
            'email' => 'maria@sistema.com',
            'password' => Hash::make('password123'),
            'estado' => true,
            'id_faena' => $faena2->id,
        ]);

        // 3. Crear Módulos
        $moduloPetroleo = Modulo::create([
            'nombre' => 'Gestión Petróleo',
            'descripcion' => 'Sistema de gestión y control petrolero',
            'url' => 'http://localhost:3001',
            'icono' => '🛢️',
            'estado' => true,
        ]);

        $moduloProduccion = Modulo::create([
            'nombre' => 'Sistema Producción',
            'descripcion' => 'Control de producción y reportes',
            'url' => 'http://localhost:3002',
            'icono' => '📦',
            'estado' => true,
        ]);

        $moduloReportes = Modulo::create([
            'nombre' => 'Reportes',
            'descripcion' => 'Generación de reportes y estadísticas',
            'url' => 'http://localhost:3003',
            'icono' => '📊',
            'estado' => true,
        ]);

        // 4. Crear Roles
        $rolAdmin = Rol::create([
            'nombre' => 'Administrador',
            'descripcion' => 'Acceso total al sistema',
        ]);

        $rolSupervisor = Rol::create([
            'nombre' => 'Supervisor',
            'descripcion' => 'Supervisión y gestión de operaciones',
        ]);

        $rolOperario = Rol::create([
            'nombre' => 'Operario',
            'descripcion' => 'Operaciones básicas del sistema',
        ]);

        $rolVisualizador = Rol::create([
            'nombre' => 'Visualizador',
            'descripcion' => 'Solo lectura de información',
        ]);

        // 5. Crear Permisos por Módulo

        // Permisos para Gestión Petróleo
        $permisosPetroleo = [
            ['nombre' => 'ver_faenas', 'descripcion' => 'Ver listado de faenas'],
            ['nombre' => 'crear_faenas', 'descripcion' => 'Crear nuevas faenas'],
            ['nombre' => 'editar_faenas', 'descripcion' => 'Editar faenas existentes'],
            ['nombre' => 'eliminar_faenas', 'descripcion' => 'Eliminar faenas'],
            ['nombre' => 'ver_reportes', 'descripcion' => 'Ver reportes petroleros'],
        ];

        foreach ($permisosPetroleo as $permiso) {
            Permiso::create([
                'nombre' => $permiso['nombre'],
                'descripcion' => $permiso['descripcion'],
                'modulo_id' => $moduloPetroleo->id,
            ]);
        }

        // Permisos para Sistema Producción
        $permisosProduccion = [
            ['nombre' => 'ver_produccion', 'descripcion' => 'Ver datos de producción'],
            ['nombre' => 'registrar_produccion', 'descripcion' => 'Registrar nueva producción'],
            ['nombre' => 'editar_produccion', 'descripcion' => 'Editar registros de producción'],
            ['nombre' => 'eliminar_produccion', 'descripcion' => 'Eliminar registros'],
            ['nombre' => 'ver_estadisticas', 'descripcion' => 'Ver estadísticas de producción'],
        ];

        foreach ($permisosProduccion as $permiso) {
            Permiso::create([
                'nombre' => $permiso['nombre'],
                'descripcion' => $permiso['descripcion'],
                'modulo_id' => $moduloProduccion->id,
            ]);
        }

        // Permisos para Reportes
        $permisosReportes = [
            ['nombre' => 'ver_reportes', 'descripcion' => 'Ver reportes generales'],
            ['nombre' => 'generar_reportes', 'descripcion' => 'Generar nuevos reportes'],
            ['nombre' => 'exportar_reportes', 'descripcion' => 'Exportar reportes'],
        ];

        foreach ($permisosReportes as $permiso) {
            Permiso::create([
                'nombre' => $permiso['nombre'],
                'descripcion' => $permiso['descripcion'],
                'modulo_id' => $moduloReportes->id,
            ]);
        }

        // 6. Asignar Permisos a Roles

        // Administrador: Todos los permisos de todos los módulos
        $todosPermisos = Permiso::all();
        foreach ($todosPermisos as $permiso) {
            DB::table('rol_permisos')->insert([
                'rol_id' => $rolAdmin->id,
                'permiso_id' => $permiso->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Supervisor: Permisos de ver, crear y editar (sin eliminar)
        $permisosSupervisor = Permiso::whereIn('nombre', [
            'ver_faenas', 'crear_faenas', 'editar_faenas', 'ver_reportes',
            'ver_produccion', 'registrar_produccion', 'editar_produccion', 'ver_estadisticas',
            'ver_reportes', 'generar_reportes',
        ])->get();

        foreach ($permisosSupervisor as $permiso) {
            DB::table('rol_permisos')->insert([
                'rol_id' => $rolSupervisor->id,
                'permiso_id' => $permiso->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Operario: Solo permisos básicos
        $permisosOperario = Permiso::whereIn('nombre', [
            'ver_faenas', 'ver_reportes',
            'ver_produccion', 'registrar_produccion', 'ver_estadisticas',
        ])->get();

        foreach ($permisosOperario as $permiso) {
            DB::table('rol_permisos')->insert([
                'rol_id' => $rolOperario->id,
                'permiso_id' => $permiso->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Visualizador: Solo ver
        $permisosVisualizador = Permiso::where('nombre', 'like', 'ver_%')->get();

        foreach ($permisosVisualizador as $permiso) {
            DB::table('rol_permisos')->insert([
                'rol_id' => $rolVisualizador->id,
                'permiso_id' => $permiso->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 7. Asignar Usuarios a Roles en Módulos

        // Juan (Admin) - Administrador en todos los módulos
        DB::table('usuario_roles')->insert([
            ['user_id' => $admin->id, 'rol_id' => $rolAdmin->id, 'modulo_id' => $moduloPetroleo->id, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $admin->id, 'rol_id' => $rolAdmin->id, 'modulo_id' => $moduloProduccion->id, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $admin->id, 'rol_id' => $rolAdmin->id, 'modulo_id' => $moduloReportes->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // María (Operaria) - Operario en Producción, Visualizador en Petróleo
        DB::table('usuario_roles')->insert([
            ['user_id' => $operario->id, 'rol_id' => $rolOperario->id, 'modulo_id' => $moduloProduccion->id, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $operario->id, 'rol_id' => $rolVisualizador->id, 'modulo_id' => $moduloPetroleo->id, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->command->info('✅ Base de datos poblada exitosamente!');
        $this->command->info('👤 Usuario Admin: admin@sistema.com / password123');
        $this->command->info('👤 Usuario Operario: maria@sistema.com / password123');
    }
}
