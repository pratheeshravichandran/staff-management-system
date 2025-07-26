<?php

namespace App\Http\Controllers\Api;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class StaffAttendanceController extends Controller
{

    
    public function getAllStaffsWithRole3(): JsonResponse
{
    try {
        $staffs = User::where('role', 3)
            ->select('id','first_name', 'last_name', 'department_id', 'profile_pic')
            ->get()
            ->map(function ($user) {
                return [
                    'id'=>$user->id,
                    'full_name' => $user->first_name . ' ' . $user->last_name,
                    'department' => $user->department,
                    'profile_pic' => $user->profile_pic,
                    'department'=>$user->department->name??null,
                ];
            });

        return response()->json([
            'status' => true,
            'data' => $staffs
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Failed to fetch staff users.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'status' => 'required|in:present,absent,late',
                'total_working_hours' => 'required|numeric|min:0',
                'attendance_date' => 'required|date|before_or_equal:today',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $attendance = StaffAttendance::create($request->only([
                'user_id', 'status', 'total_working_hours', 'attendance_date'
            ]));

            return response()->json([
                'status' => true,
                'message' => 'Attendance recorded successfully.',
                'data' => $attendance
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error storing attendance.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $attendance = StaffAttendance::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'status' => 'in:present,absent,late',
                'total_working_hours' => 'numeric|min:0',
                'attendance_date' => 'date|before_or_equal:today',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $attendance->update($request->only([
                'status', 'total_working_hours', 'attendance_date'
            ]));

            return response()->json([
                'status' => true,
                'message' => 'Attendance updated successfully.',
                'data' => $attendance
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error updating attendance.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function index(Request $request)
    {
        try {
            $query = StaffAttendance::with('user');

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            $attendances = $query->orderBy('attendance_date', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $attendances
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching attendance records.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}