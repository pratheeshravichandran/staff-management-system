<?php

namespace App\Services;

use Kreait\Firebase\Auth;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;
use Kreait\Firebase\Factory;
use Illuminate\Support\Facades\Log;

class FirebaseService
{
    protected Auth $auth;

    public function __construct()
    {
        // Initialise the SDK once, reading credentials from config/services.php
        $this->auth = (new Factory)
            ->withServiceAccount(config('services.firebase.credentials'))
            ->withProjectId(config('services.firebase.project_id'))
            ->createAuth();
    }

    /**
     * Verify a Firebase ID token.
     *
     * @param  string  $idToken
     * @return \Kreait\Firebase\Token|false
     */
    public function verifyIdToken(string $idToken)
    {
        try {
            // Guard against obviously malformed tokens
            if (substr_count($idToken, '.') !== 2) {
                throw new \InvalidArgumentException(
                    'Malformed token: does not contain 2 dots'
                ); // typical cause of the error you saw :contentReference[oaicite:0]{index=0}
            }

            // Ask Firebase to verify signature + claims
            return $this->auth->verifyIdToken($idToken);
        } catch (FailedToVerifyToken|\InvalidArgumentException $e) {
            Log::warning('Firebase ID‑token verification failed', [
                'reason' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
