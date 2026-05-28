<?php

use App\Controllers\AuthController;
use App\Controllers\AdminUserController;
use App\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/usuarios', [AdminUserController::class, 'index']);
Route::post('/usuarios', [AdminUserController::class, 'store']);
Route::put('/usuarios/{id}', [AdminUserController::class, 'update']);

Route::get('/perfil/{id}', [ProfileController::class, 'show']);
Route::put('/perfil/{id}', [ProfileController::class, 'update']);
Route::post('/perfil/{id}/foto', [ProfileController::class, 'uploadFoto']);