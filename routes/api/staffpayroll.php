<?php
use App\Http\Controllers\Api\StaffPayrollController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum','check.role:HR,Admin'])->group(function () {
    Route::get('/get/college-staffs', [StaffPayrollController::class, 'getStaffs']);
    Route::get('/payroll', [StaffPayrollController::class, 'getCollegeStaffPayrolls']);
    Route::post('/payroll', [StaffPayrollController::class, 'store']);
    Route::put('/payroll/marked-as-credited/{id}', [StaffPayrollController::class, 'markAsCredited']);
    Route::delete('/payroll/{id}', [StaffPayrollController::class, 'destroy']);
});
Route::middleware('auth:sanctum','check.role:HR,Staff,Manager')->group(function () {
    Route::get('/payroll/my', [StaffPayrollController::class, 'getMyPayroll']);
});
Route::middleware('auth:sanctum','check.role:HR,Admin,Staff')->group(function () {
    Route::get('/staff-payroll/{staffId}', [StaffPayrollController::class, 'getPayrollByStaffId']);
});
