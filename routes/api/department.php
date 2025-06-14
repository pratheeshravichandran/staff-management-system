<?php
use App\Http\Controllers\Api\DepartmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum','check.role:Admin'])->group(function () {
    Route::post('/store/departments', [DepartmentController::class, 'store']);
    Route::get('/staff', [DepartmentController::class, 'getAllStaff']);
   Route::put('/update/departments/{id}', [DepartmentController::class, 'update']);
    Route::delete('delete/departments/{id}', [DepartmentController::class, 'destroy']);
});