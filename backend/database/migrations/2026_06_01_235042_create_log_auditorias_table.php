<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('log_auditorias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id');
            $table->foreign('admin_id')->references('id_usuario')->on('usuarios');
            $table->string('accion');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_auditorias');
    }
};