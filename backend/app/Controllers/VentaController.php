<?php

namespace App\Controllers;

use App\Models\User;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\DetalleVenta;
use App\Models\MovimientoInventario;
use App\Models\AlertaStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VentaController extends Controller
{
  public function store(Request $request)
  {
    $user = User::find($request->id_usuario);

    if (!$user || $user->rol !== 'ventas') {

      return response()->json([
        'success' => false,
        'message' => 'No autorizado.'
      ], 403);
    }

    $validator = Validator::make($request->all(), [

      'id_cliente' => 'required|integer',
      'id_usuario' => 'required|integer',

      'productos' => 'required|array|min:1',

      'productos.*.id_producto' => 'required|integer',
      'productos.*.cantidad' => 'required|integer|min:1',

    ]);

    if ($validator->fails()) {

      return response()->json([
        'success' => false,
        'errors' => $validator->errors(),
      ], 422);
    }

    DB::beginTransaction();

    try {

      $total = 0;

      $productosVenta = [];

      foreach ($request->productos as $item) {

        $producto = Producto::find($item['id_producto']);

        if (!$producto) {

          DB::rollBack();

          return response()->json([
            'success' => false,
            'message' => 'Producto no encontrado.'
          ], 404);
        }

        if ($producto->stock_actual < $item['cantidad']) {

          DB::rollBack();

          return response()->json([
            'success' => false,
            'message' => "Stock insuficiente para {$producto->nombre}"
          ], 400);
        }

        $subtotal = $producto->precio_venta * $item['cantidad'];

        $total += $subtotal;

        $productosVenta[] = [
          'producto' => $producto,
          'cantidad' => $item['cantidad'],
          'subtotal' => $subtotal,
        ];
      }

      $comprobante = 'VTA-' . now()->format('YmdHis');

      $venta = Venta::create([
        'id_cliente' => $request->id_cliente,
        'id_usuario' => $request->id_usuario,
        'fecha_venta' => now(),
        'total' => $total,
        'comprobante' => $comprobante,
      ]);

      foreach ($productosVenta as $item) {

        $producto = $item['producto'];

        DetalleVenta::create([
          'id_venta' => $venta->id_venta,
          'id_producto' => $producto->id_producto,
          'cantidad' => $item['cantidad'],
          'precio_unitario' => $producto->precio_venta,
          'subtotal' => $item['subtotal'],
        ]);

        $producto->stock_actual -= $item['cantidad'];
        $producto->save();

        // --- NUEVA LINEA: VERIFICAMOS EL STOCK LUEGO DE VENDER ---
        AlertaStock::verificarStock($producto);

        MovimientoInventario::create([
          'id_producto' => $producto->id_producto,
          'id_usuario' => $request->id_usuario,
          'tipo_movimiento' => 'SALIDA',
          'cantidad' => $item['cantidad'],
          'motivo' => 'Venta registrada',
          'fecha' => now(),
        ]);
      }

      DB::commit();

      return response()->json([
        'success' => true,
        'message' => 'Venta registrada correctamente.',
        'data' => [
          'id_venta' => $venta->id_venta,
          'comprobante' => $venta->comprobante,
          'total' => $venta->total,
        ]
      ]);

    } catch (\Exception $e) {

      DB::rollBack();

      return response()->json([
        'success' => false,
        'message' => 'Error al registrar venta.',
        'error' => $e->getMessage(),
      ], 500);
    }
  }
}

