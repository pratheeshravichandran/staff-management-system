<?php

Route::get('/', function () {
    return response()->json(['message' => 'API is working fine!']);
});

foreach (glob(__DIR__ . '/api/*.php') as $filename) {
    require $filename;
}
