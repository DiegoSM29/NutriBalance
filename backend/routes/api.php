<?php

use App\Controllers\AuthController;
use App\Controllers\AdminUserController;
use App\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Controllers\PedidoController;
use App\Controllers\ProductoController;
use App\Controllers\VentaController;
use App\Controllers\AlertaStockController;
use App\Controllers\MovimientoInventarioController;
use App\Controllers\MisVentaController;
use App\Controllers\NotificacionController;
use App\Controllers\OrdenProduccionController;
use App\Controllers\ReporteController;
use App\Controllers\RoleController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/usuarios', [AdminUserController::class, 'index']);
Route::get('/clientes', [AdminUserController::class, 'clientes']);
Route::post('/clientes', [AdminUserController::class, 'storeCliente']);
Route::post('/usuarios', [AdminUserController::class, 'store']);
Route::put('/usuarios/{id}', [AdminUserController::class, 'update']);

Route::get('/perfil/{id}', [ProfileController::class, 'show']);
Route::put('/perfil/{id}', [ProfileController::class, 'update']);
Route::post('/perfil/{id}/foto', [ProfileController::class, 'uploadFoto']);

Route::get('/catalogo', [PedidoController::class, 'catalogo']);
Route::post('/pedidos', [PedidoController::class, 'store']);
Route::get('/pedidos/cliente', [PedidoController::class, 'misPedidos']);
Route::get('/pedidos', [PedidoController::class, 'todosPedidos']);
Route::get('/pedidos/logistica', [PedidoController::class, 'pedidosLogistica']);
Route::get('/pedidos/{id}/historial', [PedidoController::class, 'historial']);
Route::put('/pedidos/{id}/estado', [PedidoController::class, 'actualizarEstado']);

Route::get('/admin/productos', [ProductoController::class, 'index']);
Route::post('/admin/productos', [ProductoController::class, 'store']);
Route::put('/admin/productos/{id}', [ProductoController::class, 'update']);
Route::delete('/admin/productos/{id}', [ProductoController::class, 'destroy']);

Route::post('/ventas', [VentaController::class, 'store']);
Route::get('/mis-ventas', [MisVentaController::class, 'index']);
Route::get('/productos/disponibles', [ProductoController::class, 'disponibles']);

Route::get('/alertas', [AlertaStockController::class, 'index']);
Route::put('/alertas/{id}/leer', [AlertaStockController::class, 'marcarLeida']);

Route::get('/movimientos', [MovimientoInventarioController::class, 'index']);
Route::post('/movimientos/entrada', [MovimientoInventarioController::class, 'entrada']);
Route::post('/movimientos/salida', [MovimientoInventarioController::class, 'salida']);

Route::get('/notificaciones', [NotificacionController::class, 'misNotificaciones']);
Route::get('/notificaciones/no-leidas', [NotificacionController::class, 'noLeidas']);
Route::put('/notificaciones/{id}/leer', [NotificacionController::class, 'marcarLeida']);
Route::put('/notificaciones/leer-todas', [NotificacionController::class, 'marcarTodasLeidas']);

Route::get('/ordenes-produccion', [OrdenProduccionController::class, 'index']);
Route::post('/ordenes-produccion', [OrdenProduccionController::class, 'store']);
Route::get('/ordenes-produccion/{id}', [OrdenProduccionController::class, 'show']);
Route::put('/ordenes-produccion/{id}', [OrdenProduccionController::class, 'update']);

Route::get('/reportes/ventas', [ReporteController::class, 'ventas']);
Route::get('/reportes/inventario', [ReporteController::class, 'inventario']);
Route::get('/reportes/produccion', [ReporteController::class, 'produccion']);

Route::put('/roles/{id}/permisos', [RoleController::class, 'actualizarPermisos']);
Route::put('/usuarios/{id}/bloquear', [RoleController::class, 'bloquearUsuario']);

