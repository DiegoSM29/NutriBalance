<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pedidos')) return;
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id('id_pedido');
            $table->unsignedBigInteger('id_cliente');
            $table->foreign('id_cliente')->references('id_cliente')->on('clientes');
            $table->dateTime('fecha_pedido');
            $table->date('fecha_entrega')->nullable();
            $table->string('estado', 20)->default('pendiente');
            $table->decimal('total', 10, 2)->default(0);
            $table->string('comprobante', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};

