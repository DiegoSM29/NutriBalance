<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('alertas_stock')) return;
        Schema::create('alertas_stock', function (Blueprint $table) {
            $table->id('id_alerta');
            $table->unsignedBigInteger('id_producto');
            $table->foreign('id_producto')->references('id_producto')->on('productos');
            $table->integer('stock_registrado'); 
            $table->boolean('leida')->default(false);
            $table->timestamp('fecha_alerta')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alertas_stock');
    }
};