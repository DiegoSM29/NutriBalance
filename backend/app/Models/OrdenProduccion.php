<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenProduccion extends Model
{
    protected $table = 'orden_produccion';
    protected $primaryKey = 'id_orden';
    public $timestamps = false;

    protected $fillable = [
        'numero_orden',
        'id_producto',
        'cantidad',
        'fecha_planificada',
        'fecha_creacion',
        'estado',
        'id_usuario',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }
}

