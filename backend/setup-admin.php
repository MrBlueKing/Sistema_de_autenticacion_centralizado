<?php

/**
 * Script para asignar rol de administrador a un usuario
 *
 * USO: php setup-admin.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "╔══════════════════════════════════════════════════════════╗\n";
echo "║     ASIGNAR ROL DE ADMINISTRADOR A UN USUARIO           ║\n";
echo "╚══════════════════════════════════════════════════════════╝\n\n";

// Listar usuarios
echo "Usuarios disponibles:\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

$users = App\Models\User::all();
foreach ($users as $user) {
    $esAdmin = $user->esAdministrador() ? '✓ ES ADMIN' : '';
    echo sprintf("%2d) %s - %s %s %s\n",
        $user->id,
        $user->rut,
        $user->nombre,
        $user->apellido,
        $esAdmin
    );
}

echo "\n";
echo "Ingresa el ID del usuario para hacerlo administrador: ";
$userId = trim(fgets(STDIN));

$user = App\Models\User::find($userId);

if (!$user) {
    echo "\n❌ Usuario no encontrado.\n";
    exit(1);
}

echo "\n";
echo "Usuario seleccionado: {$user->nombre} {$user->apellido} ({$user->rut})\n";

// Verificar si ya es admin
if ($user->esAdministrador()) {
    echo "✓ Este usuario YA es administrador.\n";
    echo "\n¿Deseas continuar de todos modos? (s/n): ";
    $continuar = trim(fgets(STDIN));
    if (strtolower($continuar) !== 's') {
        echo "Operación cancelada.\n";
        exit(0);
    }
}

// Buscar rol administrador
$rolAdmin = App\Models\Rol::where('nombre', 'administrador')->first();

if (!$rolAdmin) {
    echo "\n❌ No se encontró el rol 'administrador' en la base de datos.\n";
    echo "Creando rol administrador...\n";

    $rolAdmin = App\Models\Rol::create([
        'nombre' => 'administrador',
        'descripcion' => 'Administrador del sistema con acceso completo',
        'estado' => true,
    ]);

    echo "✓ Rol 'administrador' creado.\n";
}

// Buscar un módulo
$modulo = App\Models\Modulo::first();

if (!$modulo) {
    echo "\n❌ No hay módulos en el sistema. Creando módulo de administración...\n";

    $modulo = App\Models\Modulo::create([
        'nombre' => 'Administración',
        'descripcion' => 'Módulo de administración del sistema',
        'url' => '/admin',
        'icono' => '⚙️',
        'estado' => true,
    ]);

    echo "✓ Módulo 'Administración' creado.\n";
}

// Verificar si ya tiene la asignación
$yaAsignado = DB::table('usuario_roles')
    ->where('user_id', $user->id)
    ->where('rol_id', $rolAdmin->id)
    ->where('modulo_id', $modulo->id)
    ->exists();

if ($yaAsignado) {
    echo "\n⚠️  El usuario ya tiene el rol de administrador asignado.\n";
} else {
    // Asignar rol
    DB::table('usuario_roles')->insert([
        'user_id' => $user->id,
        'rol_id' => $rolAdmin->id,
        'modulo_id' => $modulo->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    echo "\n✓ ¡Rol de administrador asignado exitosamente!\n";
}

echo "\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "✓ Configuración completada\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "\nPuedes iniciar sesión con:\n";
echo "  RUT: {$user->rut}\n";
echo "  Contraseña: (la que configuraste)\n";
echo "\nLuego ve a: Avatar → Panel de Administración\n";
echo "\n";
