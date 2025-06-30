<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Services\FirebaseService;
use Illuminate\Http\Request;

class FirebaseAuthController extends Controller
{
    protected FirebaseService $firebase;

    public function __construct(FirebaseService $firebase)
    {
        $this->firebase = $firebase;
    }

    public function login(Request $request)
    {
        $idToken = $request->bearerToken();

        if (!$idToken) {
            return response()->json(['error' => 'Token missing'], 400);
        }

        $verifiedIdToken = $this->firebase->verifyIdToken($idToken);
        Log::debug('Incoming Firebase token', ['token' => $idToken]);


        if (!$verifiedIdToken) {
            return response()->json(['error' => 'Invalid or expired token'], 401);
        }

        $uid   = $verifiedIdToken->claims()->get('sub');
        $email = $verifiedIdToken->claims()->get('email');

        // create/find local user record
        $user = User::firstOrCreate(
            ['firebase_uid' => $uid],
            ['email' => $email]
        );

        return response()->json([
            'message' => 'User authenticated',
            'user'    => $user,
        ], 200);
    }
}
