<?php

namespace App\Controllers;

use App\Models\Producto;
use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\Cliente;
use App\Models\HistorialEstadoPedido;
use App\Models\Notificacion;
use App\Models\MovimientoInventario;
use App\Models\AlertaStock;
use App\Mail\OrderStatusMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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

    public function actualizarEstado(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:pendiente,confirmado,preparacion,enviado,entregado,rechazado',
            'observacion' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $pedido = Pedido::with(['detalles', 'cliente.usuario'])->find($id);

        if (!$pedido) {
            return response()->json(['success' => false, 'message' => 'Pedido no encontrado.'], 404);
        }

        $nuevoEstado = $request->estado;
        $estadoAnterior = $pedido->estado;

        // Validar transiciones de estado para logística
        $transicionesPermitidas = [
            'confirmado' => ['preparacion'],
            'preparacion' => ['enviado'],
            'enviado' => ['entregado'],
            'pendiente' => ['confirmado', 'rechazado'],
        ];

        if (isset($transicionesPermitidas[$estadoAnterior])) {
            if (!in_array($nuevoEstado, $transicionesPermitidas[$estadoAnterior])) {
                return response()->json([
                    'success' => false,
                    'message' => "No se puede cambiar de '{$estadoAnterior}' a '{$nuevoEstado}'. Transición no permitida."
                ], 422);
            }
        } elseif (!in_array($estadoAnterior, ['pendiente', 'confirmado', 'preparacion', 'enviado'])) {
            return response()->json([
                'success' => false,
                'message' => "El pedido está en estado '{$estadoAnterior}' y no puede modificarse."
            ], 422);
        }

        // No permitir cambiar a "entregado" sin antes pasar por "enviado"
        if ($nuevoEstado === 'entregado' && $estadoAnterior !== 'enviado') {
            return response()->json([
                'success' => false,
                'message' => 'Para marcar como entregado, el pedido debe estar en estado "enviado" primero.'
            ], 422);
        }

        if ($nuevoEstado === 'rechazado') {
            try {
                DB::beginTransaction();

                foreach ($pedido->detalles as $detalle) {
                    Producto::where('id_producto', $detalle->id_producto)
                        ->increment('stock_actual', $detalle->cantidad);

                    MovimientoInventario::create([
                        'id_producto' => $detalle->id_producto,
                        'id_usuario' => $pedido->cliente->id_usuario ?? 0,
                        'tipo_movimiento' => 'ENTRADA',
                        'cantidad' => $detalle->cantidad,
                        'motivo' => 'Devolucion por pedido rechazado #' . $pedido->id_pedido,
                        'fecha' => now(),
                    ]);
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

        $pedido->estado = $nuevoEstado;
        $pedido->save();

        // Registrar en el historial de cambios
        $historial = HistorialEstadoPedido::create([
            'id_pedido' => $pedido->id_pedido,
            'estado_anterior' => $estadoAnterior,
            'estado_nuevo' => $nuevoEstado,
            'observacion' => $request->observacion,
            'id_usuario' => $request->header('X-User-Id'),
            'fecha_cambio' => now(),
        ]);

        // Crear notificación para el cliente
        if ($pedido->cliente && $pedido->cliente->usuario) {
            $titulo = 'Estado de pedido actualizado';
            $mensaje = '';

            switch ($nuevoEstado) {
                case 'confirmado':
                    $titulo = 'Pedido confirmado';
                    $mensaje = "Tu pedido #{$pedido->id_pedido} ha sido confirmado. Pronto comenzaremos con la preparación.";
                    break;
                case 'preparacion':
                    $titulo = 'Pedido en preparación';
                    $mensaje = "Tu pedido #{$pedido->id_pedido} está siendo preparado.";
                    break;
                case 'enviado':
                    $titulo = 'Pedido enviado';
                    $mensaje = "Tu pedido #{$pedido->id_pedido} ha sido enviado. Estará pronto contigo.";
                    break;
                case 'entregado':
                    $titulo = 'Pedido entregado';
                    $mensaje = "Tu pedido #{$pedido->id_pedido} ha sido entregado con éxito. ¡Gracias por tu compra!";
                    break;
                case 'rechazado':
                    $titulo = 'Pedido rechazado';
                    $mensaje = "Tu pedido #{$pedido->id_pedido} ha sido rechazado. Si tienes dudas, contáctanos.";
                    break;
            }

            if ($mensaje) {
                Notificacion::create([
                    'id_usuario' => $pedido->cliente->usuario->id_usuario,
                    'titulo' => $titulo,
                    'mensaje' => $mensaje,
                    'tipo' => 'pedido',
                    'id_referencia' => $pedido->id_pedido,
                    'leida' => false,
                    'fecha_creacion' => now(),
                ]);
            }
        }

        // Enviar notificación por correo si el estado es "enviado" o "entregado"
        if (in_array($nuevoEstado, ['enviado', 'entregado']) && $pedido->cliente && $pedido->cliente->usuario) {
            try {
                Mail::to($pedido->cliente->usuario->correo)->send(
                    new OrderStatusMail($pedido, $estadoAnterior, $nuevoEstado, $request->observacion)
                );
            } catch (\Exception $e) {
                // No fallar si el correo no se puede enviar
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Estado del pedido actualizado a ' . $nuevoEstado . '.',
            'data' => $pedido
        ]);
    }

    public function historial(int $id)
    {
        $pedido = Pedido::find($id);

        if (!$pedido) {
            return response()->json(['success' => false, 'message' => 'Pedido no encontrado.'], 404);
        }

        $historial = HistorialEstadoPedido::with('usuario')
            ->where('id_pedido', $id)
            ->orderBy('fecha_cambio', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $historial
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

    public function pedidosLogistica()
    {
        $pedidos = Pedido::with(['detalles.producto', 'cliente.usuario'])
            ->whereIn('estado', ['confirmado', 'preparacion', 'enviado', 'entregado'])
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
                AlertaStock::verificarStock($detalle['producto']);
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
