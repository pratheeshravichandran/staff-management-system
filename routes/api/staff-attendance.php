<?php
use App\Http\Controllers\Api\StaffAttendanceController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\PostController;

Route::middleware('auth:sanctum','check.role:Admin,HR')->group(function () {
    Route::post('/staff-attendance', [StaffAttendanceController::class, 'store']);
    Route::put('/staff-attendance/{id}',[StaffAttendanceController::class,'update']);
    Route::post('/store',[PostController::class,"store"]);
    Route::get('/staff-attendance', [StaffAttendanceController::class, 'index']);
    Route::get("/get-staff-attendance",[StaffAttendanceController::class,'getAllStaffsWithRole3']);
});

Route::get('/show/{id}',[PostController::class,"show"]);
Route::delete('/delete/{id}',[PostController::class,"destroy"]);

Route::middleware('auth:sanctum','check.role:Admin')->group(function(){
    Route::get("/get-posts",[PostController::class,"index"]);
});