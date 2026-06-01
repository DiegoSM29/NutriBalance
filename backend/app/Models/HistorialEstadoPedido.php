<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialEstadoPedido extends Model
{
    protected $table = 'historial_estados_pedidos';
    protected $primaryKey = 'id_historial';
    public $timestamps = false;

    protected $fillable = [
        'id_pedido',
        'estado_anterior',
        'estado_nuevo',
        'observacion',
        'id_usuario',
        'fecha_cambio',
    ];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'id_pedido', 'id_pedido');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id_usuario');
    }
}
