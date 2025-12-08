<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Estas rutas se cargan automáticamente por Laravel en /api/*
|
*/

Route::get('/ping', function () {
    return response()->json(['message' => 'API OK']);
});

// ---------- Auth ----------
Route::post('/auth/login', [AuthController::class, 'login']);
// Recuperar / resetear contraseña por correo
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Rutas de estudiantes
    Route::get('/students', [StudentController::class, 'index']);
    Route::post('/students', [StudentController::class, 'store']);
    Route::put('/students/{id}', [StudentController::class, 'update']);
    Route::delete('/students/{id}', [StudentController::class, 'destroy']);
    Route::post('/students/assign-tutor', [StudentController::class, 'assignTutor']);
   
 // ---------- Users ----------
    Route::get('/users',              [UserController::class, 'index']);
    Route::post('/users',             [UserController::class, 'store']);
    Route::get('/users/{id}',         [UserController::class, 'show']);
    Route::put('/users/{id}',         [UserController::class, 'update']);
    Route::delete('/users/{id}',      [UserController::class, 'destroy']);  
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);
    Route::patch('/users/{id}/role',   [UserController::class, 'updateRole']);
    Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);

    Route::post('/users/{id}/reset-password', [UserController::class, 'resetPassword']);
    Route::post('/users/{id}/toggle-status',  [UserController::class, 'toggleStatus']);

});    

