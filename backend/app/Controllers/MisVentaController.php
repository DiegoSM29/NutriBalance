<?php

namespace App\Controllers;

use App\Models\Venta;
use Illuminate\Http\Request;

class MisVentaController extends Controller
{
    public function index(Request $request)
    {
        $id_usuario = $request->header('X-User-Id');

        $ventas = Venta::with(['detalles.producto', 'cliente.usuario'])
            ->where('id_usuario', $id_usuario)
            ->orderBy('fecha_venta', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $ventas
        ]);
    }
}

