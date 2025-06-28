<?php
use App\Http\Controllers\Api\BankDetailController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum','check.role:HR,Admin')->group(function () {
    Route::get('/bank-details', [BankDetailController::class, 'index']);
    Route::post('/bank-details', [BankDetailController::class, 'store']);
    Route::put('/bank-details/{id}', [BankDetailController::class, 'update']);
    Route::delete('/bank-details/{id}', [BankDetailController::class, 'destroy']);
    Route::get('/get/staffs/names', [BankDetailController::class, 'noBankDetails']);
});
Route::middleware('auth:sanctum','check.role:HR,Admin,Staff,Manager')->group(function () {
    Route::get('/bank-details/me', [BankDetailController::class, 'showMine']);
});
