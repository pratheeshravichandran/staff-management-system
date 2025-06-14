<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{
    User,
    Role,
    Department,
    DeviceToken,
    Verification,
};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Services\FileService;
use Carbon\Carbon;
class AuthController extends Controller
{
    protected FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function getMetadata(): JsonResponse
    {
        try {
            $roles = Role::where('role_name', '!=', 'Admin')->get(['id', 'role_name']);
            $genders = ['Male', 'Female', 'Other'];

            return response()->json([
                'genders' => $genders,
                'roles' => $roles,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to retrieve metadata', 'details' => $e->getMessage()], 500);
        }
    }

    public function getDepartments(): JsonResponse
    {
        try {
            $departments = Department::with('hod')->get();
    
            $formatted = $departments->map(function ($dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'hod_id' => $dept->hod_id,
                    'hod_name' => $dept->hod ? $dept->hod->first_name . ' ' . $dept->hod->last_name : null,
                    'created_at' => $dept->created_at,
                    'updated_at' => $dept->updated_at,
                ];
            });
    
            return response()->json([
                'departments' => $formatted,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to retrieve departments', 'details' => $e->getMessage()], 500);
        }
    }



    public function getAuthenticatedUser()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    return response()->json([
        'user' => [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'gender' => $user->gender,
            'staff_id'=>$user->staff_id,
            'role' => $user->role,
            'department_id' => $user->department_id,
            'role_name' => $user->roles->role_name ?? null,
            'department_name' => $user->department->name ?? null,
            'dob' => $user->dob,
            'designation' => $user->designation,
            'status' => $user->status,
            'joining_date' => $user->joining_date,
            'address' => $user->address,
            'salary' => $user->salary,
            'profile_pic' => $user->profile_pic
                ? $this->fileService->generateUrl($user->profile_pic)
                : null,
        ],
        'message' => 'Authenticated user retrieved successfully'
    ]);
}
    

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'email' => 'required|email|unique:users,email',
            'phone_number' => 'required|string|unique:users,phone_number',
            'password' => 'required|string|min:6',
            'staff_id' => 'nullable|unique:users,staff_id',
            'department_id' => 
                'required_if:role,3,4',
                'exists:departments,id',
            'role' => 'required|exists:roles,id|not_in:1',
            'dob' => 'required|date',
            'designation' => 'nullable|string|max:255',
            'profile_pic' => 'required|image|mimes:jpeg,png,jpg,gif,bmp,svg,webp,heic,heif,tiff',
            'status' => 'required|in:Active,In Active,On Leave,Resigned',
            'joining_date' => 'required|date',
            'address' => 'required|string|max:500',
            'salary' => 'required|numeric|min:0',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        try {
            DB::beginTransaction();
    
            $profilePicPath = $request->hasFile('profile_pic')
                ? $this->fileService->upload($request->file('profile_pic'), 'users', 'profile_pics')['file_path']
                : null;
    
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'gender' => $request->gender,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
                'staff_id' => $request->staff_id,
                'department_id'=>$request->department_id,
                'role' => $request->role,
                'dob' => $request->dob,
                'designation' => $request->designation,
                'profile_pic' => $profilePicPath,
                'status' => $request->status,
                'joining_date' => $request->joining_date,
                'address' => $request->address,
                'salary' => $request->salary,
            ]);
    
            DB::commit();
    
            return response()->json([
                'user_id' => $user->id,
                'message' => 'User Registered Successfully',
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
    
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'gender' => 'sometimes|required|in:Male,Female,Other',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'phone_number' => 'sometimes|required|string|unique:users,phone_number,' . $id,
            'password' => 'nullable|string|min:6',
            'staff_id' => 'nullable|unique:users,staff_id,' . $id,
            'department_id' => 'required_if:role,3,4|nullable|exists:departments,id',
            'role' => 'sometimes|required|exists:roles,id|not_in:1',
            'dob' => 'sometimes|required|date',
            'designation' => 'nullable|string|max:255',
            'profile_pic' => 'nullable|image|mimes:jpeg,png,jpg,gif,bmp,svg,webp,heic,heif,tiff',
            'status' => 'sometimes|required|in:Active,Inactive,On Leave,Resigned',
            'joining_date' => 'sometimes|required|date',
            'address' => 'sometimes|required|string|max:500',
            'salary' => 'sometimes|required|numeric|min:0',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        try {
            DB::beginTransaction();
    
            if ($request->hasFile('profile_pic')) {
                $profilePicPath = $this->fileService->upload($request->file('profile_pic'), 'users', 'profile_pics')['file_path'];
                $user->profile_pic = $profilePicPath;
            }
    
            $user->update([
                'first_name' => $request->first_name ?? $user->first_name,
                'last_name' => $request->last_name ?? $user->last_name,
                'gender' => $request->gender ?? $user->gender,
                'email' => $request->email ?? $user->email,
                'phone_number' => $request->phone_number ?? $user->phone_number,
                'password' => $request->password ? Hash::make($request->password) : $user->password,
                'staff_id' => $request->staff_id ?? $user->staff_id,
                'department_id' => $request->department_id ?? $user->department_id,
                'role' => $request->role ?? $user->role,
                'dob' => $request->dob ?? $user->dob,
                'designation' => $request->designation ?? $user->designation,
                'status' => $request->status ?? $user->status,
                'joining_date' => $request->joining_date ?? $user->joining_date,
                'address' => $request->address ?? $user->address,
                'salary' => $request->salary ?? $user->salary,
            ]);
    
            DB::commit();
    
            return response()->json(['message' => 'User updated successfully']);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    


    public function getAllStaffs()
    {
        $staff = User::with(['roles', 'department'])->where('role', '!=', 1)->get();
    
        $transformed = $staff->map(function ($user) {
            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'staff_id' => $user->staff_id,
                'dob' => $user->dob,
                'designation' => $user->designation,
                'role_name' => $user->roles->role_name ?? null, // <- Only role_name here
                'gender' => $user->gender,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'profile_pic' => $user->profile_pic ? $this->fileService->generateUrl($user->profile_pic) : null,
                'department_id'=>$user->department_id,
                'department'=>$user->department->name??null,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'status' => $user->status,
                'joining_date' => $user->joining_date,
                'address' => $user->address,
                'salary' => $user->salary,
            ];
        });
    
        return response()->json(['staff' => $transformed]);
    }
    
    

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required_without:phone_number|email',
                'phone_number' => 'required_without:email|string',
                'password' => 'required',
                'device_token' => 'nullable|string',
                'device_type' => 'nullable|string',
            ]);

            if ($request->filled('email')) {
                $request->merge(['email' => trim($request->email)]);
            }

            if($request->filled('phone_number')) {
                $request->merge(['phone_number' => trim($request->phone_number)]);
            }

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = User::where(function ($query) use ($request) {
                if ($request->filled('email')) {
                    $query->where('email', $request->email);
                }
                if ($request->filled('phone_number')) {
                    $query->orWhere('phone_number', $request->phone_number);
                }
            })->first();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            if (!Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Invalid password'], 401);
            }
            $token = $user->createToken('auth_token');
            $plainTextToken = $token->plainTextToken;
            $tokenId = $token->accessToken->id;

            if ($request->filled('device_token')) {
                DeviceToken::create([
                    'user_id' => $user->id,
                    'device_token' => $request->device_token,
                    'personal_access_token_id' => $tokenId,
                    'device_type' => $request->device_type,
                ]);
            }

            $user->tokens()->where('last_used_at', '<', Carbon::now()->subDays(3))->delete();

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $plainTextToken,
                'role' => $user->roles->role_name,
                'token_type' => 'Bearer',
                'user' => $user->makeHidden(['password'])
                    ->setAttribute('profile_pic', $user->profile_pic ? $this->fileService->generateUrl($user->profile_pic) : null)

            ]);
        } catch (Exception $e) {
            return response()->json(['error' => 'Login failed', 'details' => $e->getMessage()], 500);
        }
    }

    public function delete($id)
{
    try {
        $user = User::findOrFail($id);
 // Optional: Delete profile picture file if stored locally
        if ($user->profile_pic && \Storage::disk('public')->exists($user->profile_pic)) {
            \Storage::disk('public')->delete($user->profile_pic);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['error' => 'User not found.'], 404);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete user. ' . $e->getMessage()], 500);
    }
}




    public function logout(Request $request)
    {
        try {
            if (!$user = $request->user()) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            if ($request->input('all', false)) {
                $user->tokens()->delete();
                $user->deviceTokens()->delete();
                return response()->json(['message' => 'Logged out from all devices'], 200);

            } else {
                $currentAccessToken = $user->currentAccessToken();
                $tokenId = $currentAccessToken->id;
                $currentAccessToken->delete();
                $user->deviceTokens()->where('personal_access_token_id', $tokenId)->delete();
                return response()->json(['message' => 'Logged out'], 200);
            }

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Logout failed',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
