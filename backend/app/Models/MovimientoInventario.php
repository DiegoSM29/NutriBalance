<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoInventario extends Model
{
    protected $table = 'movimientos_inventario';
    protected $primaryKey = 'id_movimiento';
    public $timestamps = false;

    protected $fillable = [
        'id_producto',
        'id_usuario',
        'tipo_movimiento',
        'cantidad',
        'motivo',
        'fecha',
    ];
}