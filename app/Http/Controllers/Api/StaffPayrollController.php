<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\StaffPayroll;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Exception;

class StaffPayrollController extends Controller
{

    public function getStaffs()
    {
        $collegeId = Auth::user()->college_id;
    
        $staff = User::with(['latestPayroll' => function ($query) {
                $query->select('staff_payroll.id', 'staff_payroll.staff_id', 'staff_payroll.net_salary');
            }])
            ->where('role', '!=', 1)
            ->select('id', 'first_name', 'last_name','department_id','role','designation','email','phone_number','joining_date','staff_id')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'full_name' => trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
                    'department' => optional($user->department)->name ?? null,
                    'designation' => $user->designation ?? null,
                    'staff_id' => $user->staff_id ?? null,
                    'email' => $user->email ?? null,
                    'role_name'=>$user->roles->role_name,
                    'phone_number' => $user->phone_number ?? null,
                    'joining_date'=>$user->joining_date,
                    'net_salary' => optional($user->latestPayroll)->net_salary ?? null,
                ];
            });
    
        return response()->json([
            'message' => 'Filtered staff with payroll fetched successfully',
            'staff' => $staff
        ]);
    }
    

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'staff_id' => 'required|exists:users,id',
                'basic_pay' => 'required|numeric',
                'hra' => 'nullable|numeric',
                'da' => 'nullable|numeric',
                'ta' => 'nullable|numeric',
                'pf_deduction' => 'nullable|numeric',
                'esi_deduction' => 'nullable|numeric',
                'sd_deduction' => 'nullable|numeric',
                'professional_tax' => 'nullable|numeric',
                'income_tax' => 'nullable|numeric',
                'other_tax' => 'nullable|numeric',
                'loan_penalty' => 'nullable|numeric',
                'payment_month' => 'required|date',
            ]);
    
            $gross = $validated['basic_pay'] + ($validated['hra'] ?? 0) + ($validated['da'] ?? 0) + ($validated['ta'] ?? 0);
            $deductions = ($validated['pf_deduction'] ?? 0) + ($validated['esi_deduction'] ?? 0) +
                          ($validated['sd_deduction'] ?? 0) + ($validated['professional_tax'] ?? 0) +
                          ($validated['income_tax'] ?? 0) + ($validated['other_tax'] ?? 0) +
                          ($validated['loan_penalty'] ?? 0);
    
            $validated['gross_salary'] = $gross;
            $validated['net_salary'] = $gross - $deductions;
    
            // Check if a payroll already exists for the given staff_id and payment_month
            $payroll = StaffPayroll::where('staff_id', $validated['staff_id'])
                ->whereMonth('payment_month', '=', date('m', strtotime($validated['payment_month'])))
                ->whereYear('payment_month', '=', date('Y', strtotime($validated['payment_month'])))
                ->first();
    
            if ($payroll) {
                $payroll->update($validated);
                $message = 'Payroll updated successfully';
            } else {
                $payroll = StaffPayroll::create($validated);
                $message = 'Payroll created successfully';
            }
    
            return response()->json([
                'message' => $message,
                'data' => $payroll
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to process payroll',
                'error' => $e->getMessage()
            ], 500);
        }
    }
        

    public function destroy($id)
    {
        try {
            $payroll = StaffPayroll::findOrFail($id);
            $payroll->delete();

            return response()->json([
                'message' => 'Payroll record deleted successfully'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete payroll record',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function getMyPayroll()
    {
        try {
            $staffId = Auth::id();

            $payrolls = StaffPayroll::where('staff_id', $staffId)
                ->orderBy('payment_month', 'desc')
                ->get();

            if ($payrolls->isEmpty()) {
                return response()->json(['message' => 'No payroll records found'], 404);
            }

            return response()->json([
                'message' => 'Payroll records fetched successfully',
                'data' => $payrolls
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch payroll records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPayrollByStaffId($staffId)
    {
        try {
            $collegeId = Auth::user()->college_id;
    
            
            $staff = User::where('id', $staffId) // Ensures it's a staff
                         ->first();
    
            if (!$staff) {
                return response()->json([
                    'message' => 'Staff not found or does not belong to your college'
                ], 404);
            }
    
            $payrolls = StaffPayroll::where('staff_id', $staffId)
                                    ->orderBy('payment_month', 'desc')
                                    ->get();
    
            if ($payrolls->isEmpty()) {
                return response()->json([], 200);
            }
    
            return response()->json([
                'message' => 'Payroll records for the staff fetched successfully',
                'staff' => $payrolls
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch payroll records',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
  
    
    public function getCollegeStaffPayrolls()
    {
        try {
            $collegeId = Auth::user()->college_id;
    
            $payrolls = StaffPayroll::with(['staff' => function ($query) use ($collegeId) {
                $query->where('college_id', $collegeId);
            }])
            ->whereHas('staff', function ($query) use ($collegeId) {
                $query->where('college_id', $collegeId);
            })
            ->get();
    
            $data = $payrolls->map(function ($payroll) {
                return [
                    'id' => $payroll->id,
                    'staff_id' => $payroll->staff_id,
                    'first_name' => $payroll->staff->first_name ?? null,
                    'last_name' => $payroll->staff->last_name ?? null,
                    'full_name' => ($payroll->staff->first_name ?? '') . ' ' . ($payroll->staff->last_name ?? ''),
                    'designation' => $payroll->staff->designation ?? null,
                    'college_id' => $payroll->staff->college_id ?? null,
                    'basic_pay' => $payroll->basic_pay,
                    'hra' => $payroll->hra,
                    'da' => $payroll->da,
                    'ta' => $payroll->ta,
                    'pf_deduction' => $payroll->pf_deduction,
                    'esi_deduction' => $payroll->esi_deduction,
                    'sd_deduction' => $payroll->sd_deduction,
                    'professional_tax' => $payroll->professional_tax,
                    'income_tax' => $payroll->income_tax,
                    'other_tax' => $payroll->other_tax,
                    'loan_penalty' => $payroll->loan_penalty,
                    'gross_salary' => $payroll->gross_salary,
                    'net_salary' => $payroll->net_salary,
                    'payment_month' => $payroll->payment_month,
                    'payment_status' => $payroll->payment_status,
                    'created_at' => $payroll->created_at,
                    'updated_at' => $payroll->updated_at,
                ];
            });
    
            return response()->json([
                'message' => 'Payrolls of staff in your college fetched successfully',
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch payrolls',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    
}
