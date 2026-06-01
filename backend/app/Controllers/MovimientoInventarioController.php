<?php

namespace App\Controllers;

use App\Models\Producto;
use App\Models\MovimientoInventario;
use App\Models\AlertaStock;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MovimientoInventarioController extends Controller
{
    public function index(Request $request)
    {
        $user = User::find($request->header('X-User-Id'));

        if ($user && !in_array($user->rol, ['admin', 'inventario'])) {
            return response()->json(['success' => false], 403);
        }

        $movimientos = MovimientoInventario::with('producto', 'usuario')
            ->orderBy('fecha', 'desc')
            ->take(100)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $movimientos
        ]);
    }

    public function entrada(Request $request)
    {
        $user = User::find($request->header('X-User-Id'));

        if ($user && !in_array($user->rol, ['admin', 'inventario'])) {
            return response()->json(['success' => false], 403);
        }

        $validator = Validator::make($request->all(), [
            'id_producto' => 'required|integer|exists:productos,id_producto',
            'cantidad' => 'required|integer|min:1',
            'motivo' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $producto = Producto::findOrFail($request->id_producto);

            $producto->stock_actual += $request->cantidad;
            $producto->save();

            MovimientoInventario::create([
                'id_producto' => $producto->id_producto,
                'id_usuario' => $user->id_usuario,
                'tipo_movimiento' => 'ENTRADA',
                'cantidad' => $request->cantidad,
                'motivo' => $request->motivo,
                'fecha' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Entrada de stock registrada correctamente.',
                'data' => $producto->fresh()
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al registrar entrada.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function salida(Request $request)
    {
        $user = User::find($request->header('X-User-Id'));

        if ($user && !in_array($user->rol, ['admin', 'inventario'])) {
            return response()->json(['success' => false], 403);
        }

        $validator = Validator::make($request->all(), [
            'id_producto' => 'required|integer|exists:productos,id_producto',
            'cantidad' => 'required|integer|min:1',
            'motivo' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $producto = Producto::findOrFail($request->id_producto);

            if ($producto->stock_actual < $request->cantidad) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => "Stock insuficiente. Stock actual: {$producto->stock_actual}"
                ], 400);
            }

            $producto->stock_actual -= $request->cantidad;
            $producto->save();

            MovimientoInventario::create([
                'id_producto' => $producto->id_producto,
                'id_usuario' => $user->id_usuario,
                'tipo_movimiento' => 'SALIDA',
                'cantidad' => $request->cantidad,
                'motivo' => $request->motivo,
                'fecha' => now(),
            ]);

            AlertaStock::verificarStock($producto);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Salida de stock registrada correctamente.',
                'data' => $producto->fresh()
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al registrar salida.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
