<?php

namespace App\Controllers;

use App\Models\Producto;
use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PedidoController extends Controller
{
    public function catalogo()
    {
        // Traemos productos con stock mayor a 0 (No hay columna estado, asi que la quitamos)
        $productos = Producto::where('stock_actual', '>', 0)->get();

        return response()->json([
            'success' => true,
            'data' => $productos
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'productos' => 'required|array|min:1',
            'productos.*.id_producto' => 'required|exists:productos,id_producto',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $id_usuario = $request->header('X-User-Id'); 
        
        // BUSCAMOS AL CLIENTE ASOCIADO A ESTE USUARIO
        $cliente = Cliente::where('id_usuario', $id_usuario)->first();
        
        if (!$cliente) {
            return response()->json(['success' => false, 'message' => 'El usuario no es un cliente valido.'], 403);
        }

        try {
            DB::beginTransaction();

            $total_pedido = 0;
            $detalles_a_insertar = [];

            foreach ($request->productos as $item) {
                $producto = Producto::where('id_producto', $item['id_producto'])->lockForUpdate()->first();

                // Validamos con stock_actual
                if ($producto->stock_actual < $item['cantidad']) {
                    throw new \Exception("Stock insuficiente para: {$producto->nombre}");
                }

                // Calculamos con precio_venta
                $subtotal = $producto->precio_venta * $item['cantidad'];
                $total_pedido += $subtotal;

                $detalles_a_insertar[] = [
                    'producto' => $producto,
                    'cantidad' => $item['cantidad'],
                    'subtotal' => $subtotal
                ];
            }

            // Crear el Pedido Principal (relacionado al id_cliente)
            $pedido = Pedido::create([
                'id_cliente' => $cliente->id_cliente,
                'fecha_pedido' => now(),
                'estado' => 'pendiente',
                'total' => $total_pedido
            ]);

            // Crear Detalles y descontar Stock
            foreach ($detalles_a_insertar as $detalle) {
                DetallePedido::create([
                    'id_pedido' => $pedido->id_pedido,
                    'id_producto' => $detalle['producto']->id_producto,
                    'cantidad' => $detalle['cantidad'],
                    'subtotal' => $detalle['subtotal']
                ]);

                // Restamos del stock_actual
                $detalle['producto']->stock_actual -= $detalle['cantidad'];
                $detalle['producto']->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pedido realizado con exito.',
                'data' => $pedido
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}