<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // FK a faenas
            $table->foreignId('id_faena')->nullable()->constrained('faenas')->onUpdate('cascade')->onDelete('set null');

            // Estado del usuario (activo/inactivo)
            $table->tinyInteger('estado')->default(1)->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['id_faena']); // quitar la FK primero
            $table->dropColumn(['id_faena', 'estado']);
        });
    }
};
