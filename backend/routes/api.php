<?php

use App\Controllers\AuthController;
use App\Controllers\AdminUserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/usuarios', [AdminUserController::class, 'index']);
Route::post('/usuarios', [AdminUserController::class, 'store']);
Route::put('/usuarios/{id}', [AdminUserController::class, 'update']);