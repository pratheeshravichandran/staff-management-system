<?php

namespace App\Http\Controllers\Api;
use App\Models\Post;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class PostController extends Controller
{
    
    public function index()
    {
        $data=Post::with('user:id,first_name,last_name')
        ->where('title','good')->get();
         
        if($data->isEmpty())
        {
            return response()->json([
                "message"=>"no data found",
                "data"=>[],
            ],200);
        }
        return response()->json([
            "data"=>$data,
        ],200);
    }

    
    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        $user=Auth::user();

        $validated=$request->validate([
            "title"=>"required|string",
            "name"=>"required|string",
            "content"=>"required|string|max:255",
        ]);
        $validated['user_id']=$user->id;

        $content=Post::create($validated);

        return response()->json([
            "data"=>$content,
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data=Post::findorFail($id);
        return response()->json([
            "data"=>$data,
        ],200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post=Post::findorFail($id);
        $post->delete();
       
        return response()->json([
            "message"=>"post deleted succesfully",
        ]);
    }
}
