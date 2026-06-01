<?php

namespace App\Controllers;

use App\Models\AlertaStock;
use Illuminate\Http\Request;

class AlertaStockController extends Controller
{
    // Obtener las alertas no leidas
    public function index(Request $request)
    {
        // Traemos las alertas que no han sido leidas ordenadas por la mas reciente
        $alertas = AlertaStock::with('producto')
            ->where('leida', false)
            ->orderBy('fecha_alerta', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $alertas
        ]);
    }

    // Marcar una alerta como leida para que desaparezca
    public function marcarLeida($id)
    {
        $alerta = AlertaStock::find($id);
        
        if ($alerta) {
            $alerta->leida = true;
            $alerta->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Alerta marcada como leida.'
        ]);
    }
}