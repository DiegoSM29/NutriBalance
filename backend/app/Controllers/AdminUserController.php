<?php

namespace App\Controllers;

use App\Models\User;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminUserController extends Controller
{
    public function clientes(Request $request)
    {
        $admin = User::find($request->header('X-User-Id'));
        if (!$admin || !in_array($admin->rol, ['super-admin', 'admin', 'ventas'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

        $usuarios = User::where('rol', 'cliente')
            ->with('cliente')
            ->get()
            ->map(function ($user) {
                return [
                    'id_cliente' => $user->cliente?->id_cliente,
                    'id_usuario' => $user->id_usuario,
                    'nombre'     => $user->nombre,
                    'apellido'   => $user->apellido,
                    'correo'     => $user->correo,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $usuarios
        ]);
    }

    public function index(Request $request)
    {
        $admin = User::find($request->header('X-User-Id'));
        if (!$admin || !in_array($admin->rol, ['super-admin', 'admin', 'ventas'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

        $query = User::with('roles');

        if ($request->filled('rol')) {
            $query->where('rol', $request->rol);
        }

        if ($request->filled('buscar')) {
            $buscar = $request->buscar;
            $query->where(function($q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                  ->orWhere('apellido', 'like', "%{$buscar}%")
                  ->orWhere('correo', 'like', "%{$buscar}%");
            });
        }

        $usuarios = $query->get()->map(function($u) use ($admin) {
            if ($u->hasRole('super-admin') && !$admin->hasRole('super-admin')) {
                $u->rol = 'admin'; 
            }
            return $u;
        });

        return response()->json([
            'success' => true,
            'data' => $usuarios
        ]);
    }

    public function store(Request $request)
    {
        $admin = User::find($request->header('X-User-Id'));
        if (!$admin || !in_array($admin->rol, ['admin', 'super-admin'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nombre'    => 'required|string|max:30',
            'apellido'  => 'required|string|max:30',
            'correo'    => 'required|email|unique:usuarios,correo',
            'password'  => 'required|string|min:8',
            'rol'       => 'required|in:super-admin,admin,ventas,inventario,produccion,logistica,pedidos,cliente'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false, 
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'nombre'   => $request->nombre,
            'apellido' => $request->apellido,
            'correo'   => $request->correo,
            'password' => $request->password,
            'rol'      => $request->rol,
            'estado'   => true
        ]);

        $user->assignRole($request->rol);

        Log::info("Administrador creo un nuevo usuario: {$user->correo} con rol {$user->rol}");

        return response()->json([
            'success' => true, 
            'message' => 'Usuario creado con exito.'
        ], 201);
    }

    public function storeCliente(Request $request)
    {
        $user = User::find($request->header('X-User-Id'));
        if (!$user || !in_array($user->rol, ['super-admin', 'admin', 'ventas'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nombre'    => 'required|string|max:30',
            'apellido'  => 'required|string|max:30',
            'correo'    => 'required|email|unique:usuarios,correo',
            'telefono'  => 'nullable|string|max:16',
            'direccion' => 'nullable|string|max:40',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $newUser = User::create([
            'nombre'   => $request->nombre,
            'apellido' => $request->apellido,
            'correo'   => $request->correo,
            'password' => 'user123',
            'rol'      => 'cliente',
            'estado'   => true,
        ]);

        $newUser->assignRole('cliente');

        $cliente = Cliente::create([
            'id_usuario'  => $newUser->id_usuario,
            'telefono'    => $request->telefono,
            'direccion'   => $request->direccion,
            'tipo_cliente'=> 'particular',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cliente registrado con exito.',
            'data'    => [
                'id_cliente' => $cliente->id_cliente,
                'id_usuario' => $newUser->id_usuario,
                'nombre'     => $newUser->nombre,
                'apellido'   => $newUser->apellido,
                'correo'     => $newUser->correo,
            ]
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $admin = User::find($request->header('X-User-Id'));

        if (!$admin || !in_array($admin->rol, ['admin', 'super-admin'])) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        // 1. Proteger al Super Admin
        if ($user->hasRole('super-admin') && !$admin->hasRole('super-admin')) {
            return response()->json([
                'success' => false,
                'message' => 'Acción denegada: No tienes permisos para modificar al Super Admin.'
            ], 403);
        }

        // 2. Proteger a los Administradores entre sí
        if ($user->hasRole('admin') && !$admin->hasRole('super-admin')) {
            return response()->json([
                'success' => false, 
                'message' => 'Acción denegada: Solo el Super Admin puede modificar o deshabilitar a otros Administradores.'
            ], 403);
        }

        $adminIdActual = $request->header('X-User-Id');
        if ($adminIdActual == $id && $request->has('estado') && $request->estado == false) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes deshabilitar tu propia cuenta de administrador.'
            ], 403);
        }

        if ($request->has('rol')) {
            $user->rol = $request->rol;
            $user->syncRoles([$request->rol]);
            Log::info("Usuario ID {$adminIdActual} cambió el rol del usuario ID {$id} a: {$request->rol}");
        }

        if ($request->has('estado')) {
            $user->estado = filter_var($request->estado, FILTER_VALIDATE_BOOLEAN);
            $accion = $user->estado ? 'habilitado' : 'deshabilitado';
            Log::info("Usuario ID {$id} fue {$accion} por el administrador ID {$adminIdActual}.");
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado correctamente.'
        ]);
    }
}