<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Http\Client\RequestException;

class FirebaseOtpService
{
    private Client $http;
    private string $key;

    public function __construct()
    {
        $this->key = config('auth.firebase.api_key');
        $this->http = new Client([
            'base_uri' => 'https://identitytoolkit.googleapis.com/v1/',
            'timeout'  => 5,
        ]);
    }

    /** Request SMS → returns sessionInfo string */
    public function send(string $phoneE164, string $recaptchaToken): string
    {
        $res = $this->http->post("https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key={$this->key}", [
            'json' => [
                'phoneNumber'    => $phoneE164,
                'recaptchaToken' => $recaptchaToken,
            ],
        ]);
        

        $data = json_decode($res->getBody()->getContents(), true);
        return $data['sessionInfo'];   // keep 10 min
    }

    /** Verify six‑digit code → returns Identity‑Platform response */
    public function verify(string $sessionInfo, string $code): array
    {
        $res = $this->http->post("accounts:signInWithPhoneNumber?key={$this->key}", [
            'json' => [
                'sessionInfo' => $sessionInfo,
                'code'        => $code,
            ],
        ]);

        return json_decode($res->getBody()->getContents(), true);
    }
}
