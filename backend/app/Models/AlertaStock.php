<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlertaStock extends Model
{
    protected $table = 'alertas_stock';
    protected $primaryKey = 'id_alerta';
    public $timestamps = false;

    protected $fillable = [
        'id_producto',
        'stock_registrado',
        'leida',
        'fecha_alerta',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public static function verificarStock(Producto $producto)
    {
        if ($producto->stock_actual <= $producto->stock_minimo) {
            
            $alertaHoy = self::where('id_producto', $producto->id_producto)
                ->whereDate('fecha_alerta', today())
                ->orderBy('id_alerta', 'desc')
                ->first();

            if (!$alertaHoy || $producto->stock_actual < $alertaHoy->stock_registrado) {
                self::create([
                    'id_producto' => $producto->id_producto,
                    'stock_registrado' => $producto->stock_actual
                ]);
            }
        }
    }
}