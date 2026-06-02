<?php

namespace App\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(int $id)
    {
        $user = User::with('cliente')->find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        return response()->json(['success' => true, 'data' => $user]);
    }

    public function update(Request $request, int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        if ($request->has('rol')) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes cambiar tu propio rol.'
            ], 403);
        }

        $rules = [
            'nombre'  => 'sometimes|string|max:30',
            'apellido' => 'sometimes|string|max:30',
        ];

        if ($request->filled('password')) {
            $rules['current_password'] = 'required|string';
            $rules['password'] = [
                'required', 'string', 'min:8',
                'regex:/[a-zA-Z]/', 'regex:/[0-9]/', 'confirmed'
            ];
        }

        $validator = Validator::make($request->all(), $rules, [
            'current_password.required' => 'Debes ingresar tu contraseña actual para cambiarla.',
            'password.confirmed'        => 'Las contraseñas no coinciden.',
            'password.min'              => 'La contraseña debe tener al menos 8 caracteres.',
            'password.regex'            => 'La contraseña debe contener al menos una letra y un número.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'errors'  => ['current_password' => ['La contraseña actual no es correcta.']]
                ], 422);
            }
            $user->password = $request->password;
        }

        if ($request->has('nombre')) {
            $user->nombre = $request->nombre;
        }
        if ($request->has('apellido')) {
            $user->apellido = $request->apellido;
        }

        $user->ultima_actualizacion = now();
        $user->save();

        if ($user->rol === 'cliente' && $user->cliente) {
            if ($request->has('telefono')) {
                $user->cliente->telefono = $request->telefono;
            }
            if ($request->has('direccion')) {
                $user->cliente->direccion = $request->direccion;
            }
            $user->cliente->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente.',
            'data'    => [
                'id_usuario'          => $user->id_usuario,
                'nombre'              => $user->nombre,
                'apellido'            => $user->apellido,
                'correo'              => $user->correo,
                'rol'                 => $user->rol,
                'foto'                => $user->foto,
                'ultima_actualizacion' => $user->ultima_actualizacion,
                'telefono'            => $user->cliente?->telefono,
                'direccion'           => $user->cliente?->direccion,
            ]
        ]);
    }

    public function uploadFoto(Request $request, int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('foto')) {
            if ($user->foto && file_exists(public_path($user->foto))) {
                unlink(public_path($user->foto));
            }

            $file = $request->file('foto');
            $filename = 'foto_' . $user->id_usuario . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('fotos'), $filename);
            $user->foto = 'fotos/' . $filename;
            $user->ultima_actualizacion = now();
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Foto actualizada correctamente.',
            'data'    => ['foto' => $user->foto]
        ]);
    }
}

