<?php

namespace App\Controllers;

use App\Models\User;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre'    => 'required|string|max:30',
            'apellido'  => 'required|string|max:30',
            'correo'    => 'required|string|email|max:30|unique:usuarios,correo',
            'password'  => [
                'required',
                'string',
                'min:8',
                'regex:/[a-zA-Z]/',
                'regex:/[0-9]/',
            ],
            'telefono'  => 'nullable|string|max:16',
            'direccion' => 'nullable|string|max:40',
        ], [
            'correo.unique'    => 'El correo electrónico ya está registrado.',
            'password.min'     => 'La contraseña debe tener al menos 8 caracteres.',
            'password.regex'   => 'La contraseña debe contener al menos una letra y un número.',
            'nombre.required'  => 'El nombre es obligatorio.',
            'apellido.required'=> 'El apellido es obligatorio.',
            'correo.required'  => 'El correo electrónico es obligatorio.',
            'correo.email'     => 'Ingrese un correo electrónico válido.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'nombre'   => $request->nombre,
            'apellido' => $request->apellido,
            'correo'   => $request->correo,
            'password' => $request->password,
            'rol'      => 'cliente',
            'estado'   => true,
        ]);

        $cliente = Cliente::create([
            'id_usuario'  => $user->id_usuario,
            'telefono'    => $request->telefono,
            'direccion'   => $request->direccion,
            'tipo_cliente'=> 'particular',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registro exitoso. Ya puedes iniciar sesión.',
            'data'    => [
                'usuario' => [
                    'id_usuario' => $user->id_usuario,
                    'nombre'     => $user->nombre,
                    'apellido'   => $user->apellido,
                    'correo'     => $user->correo,
                ],
                'cliente' => $cliente,
            ],
        ], 201);
    }
}
