<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('detalle_pedido')) return;
        Schema::create('detalle_pedido', function (Blueprint $table) {
            $table->id('id_detalle_pedido');
            $table->integer('id_pedido');
            $table->foreign('id_pedido')->references('id_pedido')->on('pedidos');
            $table->integer('id_producto');
            $table->foreign('id_producto')->references('id_producto')->on('productos');
            $table->integer('cantidad');
            $table->decimal('subtotal', 10, 2);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_pedido');
    }
};
