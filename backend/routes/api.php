<?php

use App\Controllers\AuthController;
use App\Controllers\AdminUserController;
use App\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Controllers\PedidoController;
use App\Controllers\ProductoController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/usuarios', [AdminUserController::class, 'index']);
Route::post('/usuarios', [AdminUserController::class, 'store']);
Route::put('/usuarios/{id}', [AdminUserController::class, 'update']);

Route::get('/perfil/{id}', [ProfileController::class, 'show']);
Route::put('/perfil/{id}', [ProfileController::class, 'update']);
Route::post('/perfil/{id}/foto', [ProfileController::class, 'uploadFoto']);

Route::get('/catalogo', [PedidoController::class, 'catalogo']);
Route::post('/pedidos', [PedidoController::class, 'store']);

Route::get('/admin/productos', [ProductoController::class, 'index']);
Route::post('/admin/productos', [ProductoController::class, 'store']);
Route::put('/admin/productos/{id}', [ProductoController::class, 'update']);
Route::delete('/admin/productos/{id}', [ProductoController::class, 'destroy']);