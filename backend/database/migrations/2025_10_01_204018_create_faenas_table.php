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
        Schema::create('faenas', function (Blueprint $table) {
            $table->id(); // id
            $table->string('ubicacion', 255);
            $table->text('detalle')->nullable();
            $table->tinyInteger('estado')->default(1); // 1 = activo, 0 = inactivo
            $table->decimal('porcentaje_tributacion', 5, 2)->default(0.00);
            $table->timestamp('fecha_creacion')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faenas');
    }
};
