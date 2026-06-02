<?php

namespace App\Controllers;

use App\Models\Producto;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductoController extends Controller
{
    private function verificarPermiso(Request $request)
    {
        $user = User::find($request->header('X-User-Id'));
        if (!$user || !in_array($user->rol, ['super-admin', 'admin', 'inventario'])) {
            return false;
        }
        return true;
    }

	public function index()
	{
		return response()->json([
			'success' => true,
			'data' => Producto::all()
		]);
	}

	public function disponibles()
	{
		$productos = Producto::where('stock_actual', '>', 0)->get();
		return response()->json([
			'success' => true,
			'data' => $productos
		]);
	}

	public function store(Request $request)
	{
        if (!$this->verificarPermiso($request)) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

		$validator = Validator::make($request->all(), [
			'nombre' => 'required|string|max:30',
			'categoria' => 'nullable|string|max:40',
			'tipo_producto' => 'nullable|string|max:40',
			'precio_venta' => 'required|numeric|min:0',
			'stock_actual' => 'required|integer|min:0',
			'stock_minimo' => 'required|integer|min:0',
			'imagen' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
		]);

		if ($validator->fails()) {
			return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
		}

		$data = $request->all();

		if ($request->hasFile('imagen')) {
			$file = $request->file('imagen');
			$filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
			$file->move(public_path('productos'), $filename);
			$data['imagen'] = 'productos/' . $filename;
		}

		$producto = Producto::create($data);

		return response()->json([
			'success' => true,
			'message' => 'Producto creado con exito.',
			'data' => $producto
		], 201);
	}

	public function update(Request $request, int $id)
	{
        if (!$this->verificarPermiso($request)) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

		$producto = Producto::find($id);

		if (!$producto) {
			return response()->json(['success' => false, 'message' => 'Producto no encontrado'], 404);
		}

		$data = $request->all();

		if ($request->hasFile('imagen')) {
			if ($producto->imagen && file_exists(public_path($producto->imagen))) {
				unlink(public_path($producto->imagen));
			}

			$file = $request->file('imagen');
			$filename = time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
			$file->move(public_path('productos'), $filename);
			$data['imagen'] = 'productos/' . $filename;
		}

		$producto->update($data);

		return response()->json([
			'success' => true,
			'message' => 'Producto actualizado correctamente.',
			'data' => $producto
		]);
	}

	public function destroy(Request $request, int $id)
	{
        if (!$this->verificarPermiso($request)) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }

		$producto = Producto::find($id);

		if (!$producto) {
			return response()->json(['success' => false, 'message' => 'Producto no encontrado'], 404);
		}

		try {
			$producto->delete();
			return response()->json([
				'success' => true,
				'message' => 'Producto eliminado correctamente.'
			]);
		} catch (\Exception $e) {
			return response()->json([
				'success' => false,
				'message' => 'No se puede eliminar el producto porque ya esta en el historial de un pedido o movimiento.'
			], 400);
		}
	}
}

