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
        Schema::table('faenas', function (Blueprint $table) {
            // Agregar campo color con un valor por defecto
            $table->string('color', 7)->default('#f97316')->after('ubicacion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faenas', function (Blueprint $table) {
            $table->dropColumn('color');
        });
    }
};
