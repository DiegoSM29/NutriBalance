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
        // 1. Borramos la tabla si quedó creada a medias
        Schema::dropIfExists('alertas_stock');

        // 2. Creamos la tabla con la estructura correcta
        Schema::create('alertas_stock', function (Blueprint $table) {
            $table->id('id_alerta');
            
            // Forzamos a que sea un entero normal para que coincida con tu tabla productos
            $table->integer('id_producto'); 
            $table->foreign('id_producto')->references('id_producto')->on('productos');
            
            $table->integer('stock_registrado'); 
            $table->boolean('leida')->default(false);
            $table->timestamp('fecha_alerta')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alertas_stock');
    }
};
