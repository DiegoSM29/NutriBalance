<?php

namespace App\Controllers;

use App\Models\AlertaStock;
use App\Models\User;
use Illuminate\Http\Request;

class AlertaStockController extends Controller
{
    // Obtener todas las alertas (leídas y no leídas para el historial)
    public function index(Request $request)
    {
        // Seguridad: Solo permitimos ver esto a admin e inventario
        $user = User::find($request->header('X-User-Id'));
        
        if ($user && !in_array($user->rol, ['admin', 'inventario'])) {
            return response()->json(['success' => false], 403);
        }

        // Traemos las últimas 50 alertas ordenadas por la más reciente
        $alertas = AlertaStock::with('producto')
            ->orderBy('fecha_alerta', 'desc')
            ->take(50) 
            ->get();

        return response()->json([
            'success' => true,
            'data' => $alertas
        ]);
    }

    // Marcar una alerta como leída (resuelta)
    public function marcarLeida($id)
    {
        $alerta = AlertaStock::find($id);
        
        if ($alerta) {
            $alerta->leida = true;
            $alerta->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Alerta marcada como leída.'
        ]);
    }
}