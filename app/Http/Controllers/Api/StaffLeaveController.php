<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileService;
use App\Models\User;
use App\Models\Department;
use App\Models\StaffLeave;
use Illuminate\Http\Request;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class StaffLeaveController extends Controller
{
    use ValidatesRequests;
    protected $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function getUrl($filePath)
    {
        try {
            return $this->fileService->generateUrl($filePath);
        } catch (Exception $e) {
            Log::error('Error retrieving URL for file path: ' . $filePath . ' - ' . $e->getMessage());
            return null;
        }
    }

    public function myLeaves()
    {
        try {
            $leaves = StaffLeave::where('staff_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->get();
    
            $leaves->transform(function ($leave) {
                if ($leave->supporting_file) {
                    $leave->supporting_file = $this->getUrl($leave->supporting_file);
                } else {
                    $leave->supporting_file = null;
                }
                return $leave;
            });
    
            return response()->json([
                'message' => 'Leave records fetched successfully.',
                'data' => $leaves
            ], 200);
    
        } catch (\Exception $e) {
            \Log::error('Failed to fetch leave records: ' . $e->getMessage());
    
            return response()->json([
                'message' => 'Failed to fetch leave records.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    
    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'leave_type' => 'required|in:Casual Leave,Permission,Sick Leave',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'supporting_file' => 'nullable|file|mimes:jpg,png,pdf,docx',
        ]);

        $validated['staff_id'] = Auth::id(); 

        if ($request->hasFile('supporting_file')) {
            $uploadfile = $this->fileService->upload($request->file('supporting_file'), 'leaves');
            if (isset($uploadfile['file_path'])) {
                $validated['supporting_file'] = $uploadfile['file_path']; 
            }
        }

        $leave = StaffLeave::create($validated);

        return response()->json([
            'message' => 'Leave request submitted successfully.',
            'data' => $leave
        ], 201);

    } catch (\Exception $e) {
        Log::error('Leave request failed: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to submit leave request.',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function updateStatus(Request $request, $id)
{
    try {
        $validated = $request->validate([
            'hr_status' => 'required|in:pending,approved,rejected',
        ]);

        $leave = StaffLeave::findOrFail($id);
        $leave->hr_status = $validated['hr_status'];
        $leave->save();

        return response()->json([
            'message' => 'Leave status updated successfully.',
            'data' => $leave
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Failed to update leave status: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to update leave status.',
            'error' => $e->getMessage()
        ], 500);
    }
}


public function destroy($id)
{
    try {
        $leave = StaffLeave::findOrFail($id);
        if ($leave->staff_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized to delete this leave request.'
            ], 403);
        }
        if ($leave->supporting_file) {
            $this->fileService->delete($leave->supporting_file);
        }
        $leave->delete();

        return response()->json([
            'message' => 'Leave request and file deleted successfully.'
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Failed to delete leave request: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to delete leave request.',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function showCollegeLeaves()
{
    try {
        $authUser = Auth::user();

        $leaves = StaffLeave::with('staff:id,first_name,last_name,email') 
            ->whereHas('staff', function ($query) use ($authUser) {
                $query->where('college_id', $authUser->college_id);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($leave) {
                $leave->supporting_file = $leave->supporting_file
                    ? $this->getUrl($leave->supporting_file)
                    : null;
                return $leave;
            });

        return response()->json([
            'message' => 'Leave records fetched successfully.',
            'data' => $leaves
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Failed to fetch college leave records: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to fetch leave records.',
            'error' => $e->getMessage()
        ], 500);
    }
}



}
   