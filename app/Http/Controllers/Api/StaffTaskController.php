<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffTask;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StaffTaskController extends Controller
{

    public function getStaffs()
    {
        $staff = User::
            where('role', '!=', 1)
            ->select('id', 'first_name', 'last_name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'full_name' => trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
                ];
            });
    
        return response()->json([
            'message' => 'Filtered staff with payroll fetched successfully',
            'staff' => $staff
        ]);
    }
    

    public function assignTask(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'task_title'    => 'required|string|max:255',
                'description'   => 'nullable|string',
                'staff_id'      => 'required|exists:users,id',
                'priority'      => 'required|in:Low,Medium,High',
                'due_date'      => 'required|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $task = StaffTask::create($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Task assigned successfully.',
                'data' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error assigning task: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function viewTasks()
    {
        try {
            $tasks = StaffTask::with(['staff:id,first_name,last_name'])->get();

            return response()->json([
                'status' => true,
                'data' => $tasks,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error retrieving tasks: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,in_progress,completed,cancelled',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $task = StaffTask::findOrFail($id);
            $task->status = $request->status;
            $task->save();

            return response()->json([
                'status' => true,
                'message' => 'Task status updated successfully.',
                'data' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error updating status: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function deleteTask($id)
    {
        try {
            $task = StaffTask::findOrFail($id);
            $task->delete();

            return response()->json([
                'status' => true,
                'message' => 'Task deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error deleting task: ' . $e->getMessage(),
            ], 500);
        }
    }
}
