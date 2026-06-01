<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('orden_produccion', 'numero_orden')) {
            return;
        }
        Schema::table('orden_produccion', function ($table) {
            $table->string('numero_orden', 20)->unique();
            $table->dateTime('fecha_creacion')->nullable();
            $table->integer('id_usuario')->nullable();
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
        });
    }

    public function down(): void
    {
    }
};
