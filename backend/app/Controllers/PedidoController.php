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
    public function todosPedidos()
    {
        $pedidos = Pedido::with(['detalles.producto', 'cliente.usuario'])
            ->orderBy('fecha_pedido', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pedidos
        ]);
    }

    public function actualizarEstado(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:pendiente,confirmado,preparacion,enviado,entregado,rechazado'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $pedido = Pedido::with('detalles')->find($id);

        if (!$pedido) {
            return response()->json(['success' => false, 'message' => 'Pedido no encontrado.'], 404);
        }

        if ($request->estado === 'rechazado') {
            try {
                DB::beginTransaction();

                foreach ($pedido->detalles as $detalle) {
                    Producto::where('id_producto', $detalle->id_producto)
                        ->increment('stock_actual', $detalle->cantidad);
                }

                DetallePedido::where('id_pedido', $id)->delete();
                $pedido->delete();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Pedido rechazado y eliminado. Stock restaurado.'
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 400);
            }
        }

        $pedido->estado = $request->estado;
        $pedido->save();

        return response()->json([
            'success' => true,
            'message' => 'Estado del pedido actualizado a ' . $request->estado . '.',
            'data' => $pedido
        ]);
    }

    public function misPedidos(Request $request)
    {
        $id_usuario = $request->header('X-User-Id');

        $cliente = Cliente::where('id_usuario', $id_usuario)->first();

        if (!$cliente) {
            return response()->json(['success' => false, 'message' => 'Cliente no encontrado.'], 404);
        }

        $pedidos = Pedido::with(['detalles.producto'])
            ->where('id_cliente', $cliente->id_cliente)
            ->orderBy('fecha_pedido', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pedidos
        ]);
    }

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
        $productos = $request->input('productos');
        if (is_string($productos)) {
            $productos = json_decode($productos, true);
        }

        $validator = Validator::make([
            'productos' => $productos,
            'comprobante' => $request->file('comprobante'),
        ], [
            'productos' => 'required|array|min:1',
            'productos.*.id_producto' => 'required|exists:productos,id_producto',
            'productos.*.cantidad' => 'required|integer|min:1',
            'comprobante' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $id_usuario = $request->header('X-User-Id'); 
        
        $cliente = Cliente::where('id_usuario', $id_usuario)->first();
        
        if (!$cliente) {
            return response()->json(['success' => false, 'message' => 'El usuario no es un cliente valido.'], 403);
        }

        try {
            DB::beginTransaction();

            $total_pedido = 0;
            $detalles_a_insertar = [];

            foreach ($productos as $item) {
                $producto = Producto::where('id_producto', $item['id_producto'])->lockForUpdate()->first();

                if ($producto->stock_actual < $item['cantidad']) {
                    throw new \Exception("Stock insuficiente para: {$producto->nombre}");
                }

                $subtotal = $producto->precio_venta * $item['cantidad'];
                $total_pedido += $subtotal;

                $detalles_a_insertar[] = [
                    'producto' => $producto,
                    'cantidad' => $item['cantidad'],
                    'subtotal' => $subtotal
                ];
            }

            $rutaComprobante = $request->file('comprobante')->store('comprobantes', 'public');

            $pedido = Pedido::create([
                'id_cliente' => $cliente->id_cliente,
                'fecha_pedido' => now(),
                'estado' => 'pendiente',
                'total' => $total_pedido,
                'comprobante' => $rutaComprobante
            ]);

            foreach ($detalles_a_insertar as $detalle) {
                DetallePedido::create([
                    'id_pedido' => $pedido->id_pedido,
                    'id_producto' => $detalle['producto']->id_producto,
                    'cantidad' => $detalle['cantidad'],
                    'subtotal' => $detalle['subtotal']
                ]);

                $detalle['producto']->stock_actual -= $detalle['cantidad'];
                $detalle['producto']->save();

                // --- NUEVA LÍNEA: VERIFICAMOS EL STOCK LUEGO DE GUARDAR ---
                \App\Models\AlertaStock::verificarStock($detalle['producto']);
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