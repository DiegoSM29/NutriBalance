<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('clientes')) return;
        Schema::create('clientes', function (Blueprint $table) {
            $table->id('id_cliente');
            $table->unsignedBigInteger('id_usuario');
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
            $table->string('telefono', 16)->nullable();
            $table->string('direccion', 40)->nullable();
            $table->string('tipo_cliente', 20)->default('particular');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};