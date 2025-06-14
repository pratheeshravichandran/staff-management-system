<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (Auth::check()) {
            $user = Auth::user(); 
                        
            if (in_array($user->roles->role_name ?? '', $roles)) {
                return $next($request);
            }
        }

        return response()->json([
            'error' => 'Unauthorized. This is an ' . implode(', ', $roles) . ' only route.'
        ], 403);
    }
}
