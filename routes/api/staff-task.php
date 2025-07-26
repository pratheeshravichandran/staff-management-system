<?php
use App\Http\Controllers\Api\StaffTaskController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SampleController;

Route::middleware('auth:sanctum','check.role:Admin,HR,Manager')->group(function() {
    Route::get('/get-staffs',[StaffTaskController::class, 'getStaffs']);
    Route::post('/assign-task', [StaffTaskController::class, 'assignTask']);
    Route::get('/view-all-task', [StaffTaskController::class, 'viewTasks']);
    Route::put('/update-task-status/{id}', [StaffTaskController::class, 'updateStatus']);
    Route::delete('/delete-task/{id}', [StaffTaskController::class, 'deleteTask']);
});

