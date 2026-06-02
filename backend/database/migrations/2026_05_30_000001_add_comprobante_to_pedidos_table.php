<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('pedidos', 'comprobante')) {
            return;
        }
        Schema::table('pedidos', function ($table) {
            $table->string('comprobante', 255)->nullable();
        });
    }

    public function down(): void
    {
    }
};

