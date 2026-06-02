<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('usuarios')) return;
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre', 30);
            $table->string('apellido', 30);
            $table->string('correo', 30)->unique();
            $table->string('password');
            $table->string('rol', 20)->default('cliente');
            $table->boolean('estado')->default(true);
            $table->string('foto', 255)->nullable();
            $table->timestamp('ultima_actualizacion')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};

