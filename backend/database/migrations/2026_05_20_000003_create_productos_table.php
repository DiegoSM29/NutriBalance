<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('productos')) return;
        Schema::create('productos', function (Blueprint $table) {
            $table->id('id_producto');
            $table->string('nombre', 30);
            $table->string('categoria', 40)->nullable();
            $table->string('tipo_producto', 40)->nullable();
            $table->decimal('precio_venta', 10, 2);
            $table->integer('stock_actual')->default(0);
            $table->integer('stock_minimo')->default(0);
            $table->string('imagen', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};

