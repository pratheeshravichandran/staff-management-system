<?php

namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\Log;
use App\Models\Department;
use App\Models\user;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'hod_id' => 'nullable|exists:users,id',
            ]);

            $department = Department::create($validated);

            return response()->json([
                'message' => 'Department created successfully',
                'data' => $department,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Department store error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to create department',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getAllStaff()
    {
        try {
            $users = User::where('role', '!=', 1)
            ->select('id', 'first_name', 'last_name')->get();
    
            // Merge names manually
            $staff = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                ];
            });
    
            return response()->json([
                'message' => 'Staff list fetched successfully',
                'data' => $staff,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch staff list: ' . $e->getMessage(),
            ], 500);
        }
    }
    public function update(Request $request, $id)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'hod_id' => 'nullable|exists:users,id',
        ]);

        $department = Department::findOrFail($id);
        $department->update($validated);

        // Reload with relationship
        $department->load('hod');

        return response()->json([
            'message' => 'Department updated successfully',
            'data' => [
                'id' => $department->id,
                'name' => $department->name,
                'hod_id' => $department->hod_id,
                'hod_name' => $department->hod
                    ? $department->hod->first_name . ' ' . $department->hod->last_name
                    : null,
            ],
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        Log::error('Department update error: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to update department',
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function destroy($id)
{
    try {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json([
            'message' => 'Department deleted successfully',
        ]);
    } catch (\Exception $e) {
        Log::error('Department delete error: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to delete department',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    

}
