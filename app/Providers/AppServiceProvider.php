<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\App;

use Illuminate\Support\ServiceProvider;
use Illuminate\Notifications\ChannelManager;
use App\Broadcasting\FirebaseNotificationChannel;
use App\Services\NotificationService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(FirebaseNotificationChannel::class, function ($app) {
            return new FirebaseNotificationChannel(new NotificationService());
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (App::environment('production')) {
            URL::forceScheme('https');
        }

        $this->app->make(ChannelManager::class)->extend('firebase', function ($app) {
            return $app->make(FirebaseNotificationChannel::class);
        });
    }
}
