<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('orden_produccion')) return;
        Schema::create('orden_produccion', function (Blueprint $table) {
            $table->id('id_orden');
            $table->string('numero_orden', 20)->unique();
            $table->unsignedBigInteger('id_producto');
            $table->foreign('id_producto')->references('id_producto')->on('productos');
            $table->integer('cantidad');
            $table->date('fecha_planificada');
            $table->dateTime('fecha_creacion')->nullable();
            $table->string('estado', 20)->default('planificada');
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orden_produccion');
    }
};

