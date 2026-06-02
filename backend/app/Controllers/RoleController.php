<?php

namespace App\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Models\LogAuditoria;
use App\Models\User;

class RoleController extends Controller
{
    // Asignar o revocar permisos a un rol
    public function actualizarPermisos(Request $request, int $id)
    {
        $request->validate([
            'permisos' => 'required|array'
        ]);

        // Obtenemos el admin usando tu sistema de Headers
        $adminActual = User::find($request->header('X-User-Id'));

        if (!$adminActual || !$adminActual->hasRole(['admin', 'super-admin'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
        }

        $rol = Role::findOrFail($id);
        
        // Evitar que le quiten permisos al super-admin
        if ($rol->name === 'super-admin' && !$adminActual->hasRole('super-admin')) {
            return response()->json(['success' => false, 'message' => 'No puedes modificar al Super Admin'], 403);
        }

        $rol->syncPermissions($request->permisos);

        // Registrar en el log de auditoría
        LogAuditoria::create([
            'admin_id' => $adminActual->id_usuario,
            'accion' => "Actualizó los permisos del rol: " . $rol->name
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permisos actualizados correctamente'
        ]);
    }

    // Bloquear un usuario protegiendo a otros admins
    public function bloquearUsuario(Request $request, int $id)
    {
        $adminActual = User::find($request->header('X-User-Id'));
        $usuarioABloquear = User::findOrFail($id);

        if (!$adminActual || !$adminActual->hasRole(['admin', 'super-admin'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado'], 403);
        }

        // Criterio de Aceptación: Un admin no puede bloquear a otro admin.
        // Solo el super-admin puede bloquear a un admin.
        if ($usuarioABloquear->hasRole('admin') && !$adminActual->hasRole('super-admin')) {
            return response()->json([
                'success' => false, 
                'message' => 'No puedes bloquear a otro administrador. Contacta al Super Admin.'
            ], 403);
        }

        // Nadie puede bloquear al super-admin
        if ($usuarioABloquear->hasRole('super-admin')) {
            return response()->json([
                'success' => false, 
                'message' => 'El Super Admin no puede ser bloqueado.'
            ], 403);
        }

        $usuarioABloquear->estado = false;
        $usuarioABloquear->save();

        LogAuditoria::create([
            'admin_id' => $adminActual->id_usuario,
            'accion' => "Bloqueó al usuario ID " . $id . " (" . $usuarioABloquear->correo . ")"
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario bloqueado correctamente'
        ]);
    }
}
