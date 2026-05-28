<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';
    protected $primaryKey = 'id_producto';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'categoria',
        'tipo_producto',
        'precio_venta',
        'stock_actual',
        'stock_minimo',
        'imagen',
    ];
    
}
