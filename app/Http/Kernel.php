<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    
    protected $middlewareGroups = [
        'web' => [
            // Middleware for web routes
        ],

        'api' => [
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        // Add your custom middleware here
        'check.role' => \App\Http\Middleware\CheckRole::class,
    ];
    protected $middleware = [
        // other middleware...
        \Illuminate\Http\Middleware\HandleCors::class,
        // other middleware...
    ];
    
}
