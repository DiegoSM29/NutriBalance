<?php

namespace App\Controllers;

use App\Models\OrdenProduccion;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrdenProduccionController extends Controller
{
    public function index(Request $request)
    {
        $query = OrdenProduccion::with(['producto', 'usuario']);

        if ($request->has('estado') && $request->estado !== '') {
            $query->where('estado', $request->estado);
        }

        $ordenes = $query->orderBy('fecha_creacion', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $ordenes
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_producto' => 'required|exists:productos,id_producto',
            'cantidad' => 'required|integer|min:1',
            'fecha_planificada' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $id_usuario = $request->header('X-User-Id');

        $year = date('Y');
        $month = date('m');
        $lastOrder = OrdenProduccion::whereYear('fecha_creacion', $year)
            ->whereMonth('fecha_creacion', $month)
            ->orderBy('id_orden', 'desc')
            ->first();

        if ($lastOrder) {
            $lastNumber = intval(substr($lastOrder->numero_orden, -4));
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        $numero_orden = 'OP-' . $year . $month . '-' . $newNumber;

        $orden = OrdenProduccion::create([
            'numero_orden' => $numero_orden,
            'id_producto' => $request->id_producto,
            'cantidad' => $request->cantidad,
            'fecha_planificada' => $request->fecha_planificada,
            'fecha_creacion' => now(),
            'estado' => 'planificada',
            'id_usuario' => $id_usuario,
        ]);

        $orden->load(['producto', 'usuario']);

        return response()->json([
            'success' => true,
            'message' => 'Orden de producción creada exitosamente.',
            'data' => $orden
        ], 201);
    }

    public function show($id)
    {
        $orden = OrdenProduccion::with(['producto', 'usuario'])->find($id);

        if (!$orden) {
            return response()->json(['success' => false, 'message' => 'Orden no encontrada.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $orden
        ]);
    }

    public function update(Request $request, $id)
    {
        $orden = OrdenProduccion::find($id);

        if (!$orden) {
            return response()->json(['success' => false, 'message' => 'Orden no encontrada.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'fecha_planificada' => 'sometimes|date',
            'cantidad' => 'sometimes|integer|min:1',
            'estado' => 'sometimes|in:planificada,en_proceso,completada,cancelada',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if ($request->has('fecha_planificada')) {
            $orden->fecha_planificada = $request->fecha_planificada;
        }
        if ($request->has('cantidad')) {
            $orden->cantidad = $request->cantidad;
        }
        if ($request->has('estado')) {
            $orden->estado = $request->estado;
        }

        $orden->save();
        $orden->load(['producto', 'usuario']);

        return response()->json([
            'success' => true,
            'message' => 'Orden de producción actualizada.',
            'data' => $orden
        ]);
    }
}
