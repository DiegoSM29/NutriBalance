<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('historial_estados_pedidos')) return;
        Schema::create('historial_estados_pedidos', function (Blueprint $table) {
            $table->id('id_historial');
            $table->unsignedBigInteger('id_pedido');
            $table->string('estado_anterior', 50)->nullable();
            $table->string('estado_nuevo', 50);
            $table->text('observacion')->nullable();
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->timestamp('fecha_cambio')->useCurrent();

            $table->index('id_pedido');
            $table->index('id_usuario');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historial_estados_pedidos');
    }
};

