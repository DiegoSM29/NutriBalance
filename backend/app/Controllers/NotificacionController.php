<?php

namespace App\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function misNotificaciones(Request $request)
    {
        $id_usuario = $request->header('X-User-Id');

        $notificaciones = Notificacion::where('id_usuario', $id_usuario)
            ->orderBy('fecha_creacion', 'desc')
            ->get();

        $noLeidas = Notificacion::where('id_usuario', $id_usuario)
            ->where('leida', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => $notificaciones,
            'no_leidas' => $noLeidas,
        ]);
    }

    public function marcarLeida(int $id)
    {
        $notificacion = Notificacion::find($id);

        if (!$notificacion) {
            return response()->json(['success' => false, 'message' => 'Notificación no encontrada.'], 404);
        }

        $notificacion->leida = true;
        $notificacion->save();

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como leída.'
        ]);
    }

    public function marcarTodasLeidas(Request $request)
    {
        $id_usuario = $request->header('X-User-Id');

        Notificacion::where('id_usuario', $id_usuario)
            ->where('leida', false)
            ->update(['leida' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Todas las notificaciones marcadas como leídas.'
        ]);
    }

    public function noLeidas(Request $request)
    {
        $id_usuario = $request->header('X-User-Id');

        $count = Notificacion::where('id_usuario', $id_usuario)
            ->where('leida', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => $count
        ]);
    }
}

