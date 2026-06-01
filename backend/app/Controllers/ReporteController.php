<?php

namespace App\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\OrdenProduccion;
use App\Models\MovimientoInventario;

class ReporteController extends Controller
{
    private function verificarAdmin(Request $request): ?\Illuminate\Http\JsonResponse {
        $user = User::find($request->header('X-User-Id'));
        if (!$user || $user->rol !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Acceso denegado. Solo administradores.'], 403);
        }
        return null;
    }

    public function ventas(Request $request)
    {
        $auth = $this->verificarAdmin($request);
        if ($auth) return $auth;
        
        $inicio = $request->inicio . ' 00:00:00';
        $fin = $request->fin . ' 23:59:59';

        $total = Venta::whereBetween('fecha_venta', [$inicio, $fin])->sum('total');

        $topProductos = DB::table('detalle_venta')
            ->join('ventas', 'detalle_venta.id_venta', '=', 'ventas.id_venta')
            ->join('productos', 'detalle_venta.id_producto', '=', 'productos.id_producto')
            ->whereBetween('ventas.fecha_venta', [$inicio, $fin])
            ->select('productos.nombre', DB::raw('SUM(detalle_venta.cantidad) as cantidad_total'), DB::raw('SUM(detalle_venta.subtotal) as ingresos'))
            ->groupBy('productos.id_producto', 'productos.nombre')
            ->orderBy('cantidad_total', 'desc')
            ->limit(5)
            ->get();

        $porVendedor = DB::table('ventas')
            ->join('usuarios', 'ventas.id_usuario', '=', 'usuarios.id_usuario')
            ->whereBetween('fecha_venta', [$inicio, $fin])
            ->select('usuarios.nombre', 'usuarios.apellido', DB::raw('SUM(total) as total_ventas'), DB::raw('COUNT(id_venta) as cantidad_ventas'))
            ->groupBy('usuarios.id_usuario', 'usuarios.nombre', 'usuarios.apellido')
            ->get();

        $porCliente = DB::table('ventas')
            ->join('clientes', 'ventas.id_cliente', '=', 'clientes.id_cliente')
            ->whereBetween('fecha_venta', [$inicio, $fin])
            ->select('clientes.tipo_cliente', DB::raw('SUM(total) as total_ventas'))
            ->groupBy('clientes.tipo_cliente')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'top_productos' => $topProductos,
                'por_vendedor' => $porVendedor,
                'por_cliente' => $porCliente
            ]
        ]);
    }

    public function inventario(Request $request)
    {
        $auth = $this->verificarAdmin($request);
        if ($auth) return $auth;

        $inicio = $request->inicio . ' 00:00:00';
        $fin = $request->fin . ' 23:59:59';

        $stockActual = Producto::select('nombre', 'categoria', 'stock_actual')->orderBy('stock_actual', 'desc')->get();
        
        $bajoStock = Producto::whereRaw('stock_actual <= stock_minimo')->select('nombre', 'stock_actual', 'stock_minimo')->get();

        $movimientos = DB::table('movimientos_inventario')
            ->whereBetween('fecha', [$inicio, $fin])
            ->select('tipo_movimiento', DB::raw('COUNT(id_movimiento) as total_movimientos'), DB::raw('SUM(cantidad) as cantidad_total'))
            ->groupBy('tipo_movimiento')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stock_actual' => $stockActual,
                'bajo_stock' => $bajoStock,
                'movimientos' => $movimientos
            ]
        ]);
    }

    public function produccion(Request $request)
    {
        $auth = $this->verificarAdmin($request);
        if ($auth) return $auth;

        $inicio = $request->inicio . ' 00:00:00';
        $fin = $request->fin . ' 23:59:59';

        $ordenes = OrdenProduccion::whereBetween('fecha_creacion', [$inicio, $fin])
            ->select('estado', DB::raw('COUNT(id_orden) as total_ordenes'), DB::raw('SUM(cantidad) as cantidad_total'))
            ->groupBy('estado')
            ->get();

        $masProducidos = DB::table('orden_produccion')
            ->join('productos', 'orden_produccion.id_producto', '=', 'productos.id_producto')
            ->whereBetween('fecha_creacion', [$inicio, $fin])
            ->where('estado', 'completada')
            ->select('productos.nombre', DB::raw('SUM(orden_produccion.cantidad) as total_producido'))
            ->groupBy('productos.id_producto', 'productos.nombre')
            ->orderBy('total_producido', 'desc')
            ->limit(5)
            ->get();

        $totalOrdenes = OrdenProduccion::whereBetween('fecha_creacion', [$inicio, $fin])->count();
        $completadas = OrdenProduccion::whereBetween('fecha_creacion', [$inicio, $fin])->where('estado', 'completada')->count();
        $eficiencia = $totalOrdenes > 0 ? round(($completadas / $totalOrdenes) * 100, 2) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'resumen_estados' => $ordenes,
                'mas_producidos' => $masProducidos,
                'eficiencia' => $eficiencia
            ]
        ]);
    }
}