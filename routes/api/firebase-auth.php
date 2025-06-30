<?php

use App\Http\Controllers\Api\FirebaseAuthController;
use Illuminate\Support\Facades\Route;

Route::post('/firebase-login', [FirebaseAuthController::class, 'login']);
