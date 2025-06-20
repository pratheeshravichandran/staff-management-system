<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Services\FileService;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Log;
use Exception;

class AnnouncementController extends Controller
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
    public function index()
    {
        try {
            $user = auth()->user();
            $announcements = Announcement::where('user_id', $user->id)
                ->orderBy('published_at', 'desc')
                ->get()
                ->map(function ($announcement) {
                    if ($announcement->file) {
                        $announcement->file = $this->getUrl($announcement->file);
                    }
                    return $announcement;
                });

            return response()->json([
                'message' => 'User\'s announcements retrieved successfully.',
                'data' => $announcements,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getOptions()
    {
        $user = Auth::user();
        try {
            $collegeId = $user->college_id;
            $degrees = Degree::where('college_id', $collegeId)->get();
            $departments = Department::whereIn('degree_id', $degrees->pluck('id'))->get();
            $batches = Batch::whereIn('department_id', $departments->pluck('id'))
                        ->active()
                        ->get();
            $classes = ClassModel::whereIn('batch_id', $batches->pluck('id'))->get();
            return response()->json([
                'degrees' => $degrees,
                'departments' => $departments,
                'batches' => $batches,
                'classes' => $classes,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();    
        try {
            $collegeId = $user->college_id;
            $filePath = ['url' => '', 'file_path' => null]; // Ensure $filePath is always initialized
                $validated = $request->validate([
                    'title' => 'required|string|max:255',
                    'message' => 'required|string',
                    'file' => 'nullable|file|mimes:jpg,jpeg,png,gif,pdf,doc,docx,ppt,pptx|max:5120',
                ]);
            if ($request->hasFile('file')) {
                $filePath = $this->fileService->upload($request->file('file'), 'announcements');
                $validated['file'] = $filePath['file_path'] ?? null;
            }
    
            $validated['user_id'] = $user->id;
            $validated['sent_by'] = $user->roles()->first()->role_name;
            $validated['published_at'] = now();
            $announcement = Announcement::create($validated);
            return response()->json([
                'message' => 'Announcement created successfully.',
                'data' => $announcement,
            ], 201);
        } catch (Exception $e) {
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                return response()->json([$e->errors()], 422);
            }
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        try {
            $announcement = Announcement::find($id);

            if (!$announcement) {
                return response()->json(['message' => 'Announcement not found.'], 404);
            }

            if ($announcement->user_id != $user->id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'message' => 'sometimes|required|string',
                'file' => 'nullable|file|mimes:jpg,jpeg,png,gif,pdf,doc,docx,ppt,pptx|max:5120',
            ]);
            if ($request->hasFile('file')) {
                if ($announcement->file) {
                    $this->fileService->delete($announcement->file);
                }
                $filePath = $this->fileService->upload(
                    $request->file('file'),
                    'announcements'
                );
                $validated['file'] = $filePath['file_path'] ?? null;
            }

            $announcement->update($validated);

            return response()->json([
                'message' => 'Announcement updated successfully.',
                'data' => $announcement,
            ]);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();
        try {
            $announcement = Announcement::find($id);

            if (!$announcement) {
                return response()->json(['message' => 'Announcement not found.'], 404);
            }

            if ($announcement->user_id != $user->id) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
            if ($announcement->file) {
                $this->fileService->delete($announcement->file);
            }
            $announcement->delete();

            return response()->json(['message' => 'Announcement deleted successfully.']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function show(Request $request)
    {
        $user = Auth::user();
        try {
            $announcements = Announcement::where(function ($query) use ($user) {
                $query->where(function ($subQuery) {
                    $subQuery->whereIn('sent_by', ['Super Admin', 'Admin']);
                })
                    ->orWhere(function ($subQuery) use ($user) {
                        $subQuery->where('sent_by', 'College Management')
                            ->where('college_id', $user->college_id);
                    })
                    ->orWhere(function ($subQuery) use ($user) {
                        $subQuery->where('sent_by', 'Staff')
                            ->where('college_id', $user->college_id)
                            ->where('department_id', $user->department_id)
                            ->when($user->batch_id, function ($query) use ($user) {
                                $query->where('batch_id', $user->batch_id);
                            })
                            ->when($user->class_id, function ($query) use ($user) {
                                $query->where('class_id', $user->class_id);
                            });
                    });
            })
                ->orderBy('created_at', 'desc')
                ->get();

            foreach ($announcements as $announcement) {
                if ($announcement->file) {
                    $announcement->file = $this->getUrl($announcement->file);
                }
                $announcement->makeHidden(['user']);
            }
            return response()->json($announcements);
        } catch (Exception $e) {
            Log::error('Error retrieving announcements: ' . $e->getMessage());
            return response()->json([$e->getMessage()], 500);
        }
    }

}
