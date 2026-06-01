<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orden_produccion', function (Blueprint $table) {
            $table->string('numero_orden', 20)->unique()->after('id_orden');
            $table->dateTime('fecha_creacion')->after('fecha_planificada')->nullable();
            $table->integer('id_usuario')->after('estado')->nullable();
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
        });
    }

    public function down(): void
    {
        Schema::table('orden_produccion', function (Blueprint $table) {
            $table->dropForeign(['id_usuario']);
            $table->dropColumn(['numero_orden', 'fecha_creacion', 'id_usuario']);
        });
    }
};
