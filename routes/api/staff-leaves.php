<?php

use App\Http\Controllers\Api\StaffLeaveController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum','check.role:Staff,Manager,HR')->group(function () {
    Route::get('/staff/leaves', [StaffLeaveController::class, 'myLeaves']);
    Route::post('/staff/leaves', [StaffLeaveController::class, 'store']);
    Route::delete('/staff/leaves/{id}', [StaffLeaveController::class, 'destroy']);
});
Route::middleware('auth:sanctum','check.role:Admin')->group(function () {
    Route::put('/staff/leaves/status/{id}', [StaffLeaveController::class, 'updateStatus']);
    Route::get('/college/staff/leaves', [StaffLeaveController::class, 'showCollegeLeaves']);
});