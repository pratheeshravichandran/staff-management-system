<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FileService;
use App\Models\BankDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Throwable;

class BankDetailController extends Controller
{

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

    public function index(Request $request)
    {
        try {
            $data = BankDetail::with('user:id,first_name,last_name,profile_pic,staff_id')
                ->get()
                ->map(function ($bank) {
                    if ($bank->user) {
                        $bank->user->full_name = trim($bank->user->first_name . ' ' . $bank->user->last_name);
    
                        if ($bank->user->profile_pic) {
                            $bank->user->profile_pic = $this->getUrl($bank->user->profile_pic);
                        }
                    } else {
                        $bank->user = null; // handle missing user
                    }
    
                    return $bank;
                });
    
            return response()->json($data, 200);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Could not fetch bank details',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    

    public function store(Request $request)
    {
        try {
        $validator = Validator::make($request->all(), [
            'user_id'             => 'required|exists:users,id|unique:bank_details,user_id',
            'bank_name'           => 'required|string|max:100',
            'branch'              => 'required|string|max:100',
            'ifsc_code'           => 'required|string|size:11',
            'account_holder_name' => 'required|string|max:150',
            'account_number'      => 'required|string|max:32',  
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

            $detail = BankDetail::create($validator->validated());
            return response()->json($detail, 201);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Could not save bank detail',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function showMine(Request $request)
    {
        try {
            $detail = BankDetail::where('user_id', $request->user()->id)->firstOrFail();
            return response()->json($detail, 200);
        } catch (ModelNotFoundException) {
            return response()->json(['message' => 'No bank detail found'], 404);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Could not fetch bank detail',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $detail = BankDetail::findOrFail($id);
            if ($request->user()->id !== $detail->user_id && $request->user()->role !== 'HR') {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            $validator = Validator::make($request->all(), [
                'bank_name'           => 'sometimes|string|max:100',
                'branch'              => 'sometimes|string|max:100',
                'ifsc_code'           => 'sometimes|string|size:11',
                'account_holder_name' => 'sometimes|string|max:150',
                'account_number'      => 'sometimes|string|max:32',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $detail->update($validator->validated());
            return response()->json($detail, 200);
        } catch (ModelNotFoundException) {
            return response()->json(['message' => 'Bank detail not found'], 404);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Could not update bank detail',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a record (HR, or owner).
     */
    public function destroy(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $detail = BankDetail::findOrFail($id);

            if ($request->user()->id !== $detail->user_id && $request->user()->role !== 'HR') {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            $detail->delete();
            DB::commit();

            return response()->json(['message' => 'Bank detail deleted'], 200);
        } catch (ModelNotFoundException) {
            DB::rollBack();
            return response()->json(['message' => 'Bank detail not found'], 404);
        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Could not delete bank detail',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function noBankDetails()
    {
        $staff = User::query()
            ->select([
                'id',
                DB::raw("CONCAT(first_name, ' ', last_name) AS full_name"),
            ])
            ->whereDoesntHave('bankDetails')   // assumes hasOne/hasMany relation
            ->orderBy('first_name')
            ->get();

        return response()->json($staff, 200);
    }
}
