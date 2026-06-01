<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('notificaciones')) return;
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id('id_notificacion');
            $table->unsignedBigInteger('id_usuario');
            $table->string('titulo', 200);
            $table->text('mensaje');
            $table->string('tipo', 50)->default('pedido');
            $table->unsignedBigInteger('id_referencia')->nullable();
            $table->boolean('leida')->default(false);
            $table->timestamp('fecha_creacion')->useCurrent();

            $table->index('id_usuario');
            $table->index('leida');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
