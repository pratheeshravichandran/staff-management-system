<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
Route::middleware('auth:sanctum','check.role:Admin,HR')->group(function () {
    Route::get('/get/metadata', [AuthController::class, 'getMetadata']);
    Route::get('/departments', [AuthController::class, 'getDepartments']);
    Route::get('/get/allstaffs', [AuthController::class, 'getAllStaffs']);
    Route::get('/auth-user', [AuthController::class, 'getAuthenticatedUser']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::delete('/delete/user/{id}', [AuthController::class, 'delete']);

});
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth:sanctum');

Route::middleware('auth:sanctum','check.role:Admin,HR,Staff,Manager')->group(function () {
    Route::get('/auth-user', [AuthController::class, 'getAuthenticatedUser']);
    Route::post('/update/user/{id}', [AuthController::class, 'updateUser']);
});
Route::prefix('otp')->middleware('api')->group(function () {
    Route::post('/send',   [AuthController::class, 'send']);
    Route::post('/verify', [AuthController::class, 'verify']);
});
