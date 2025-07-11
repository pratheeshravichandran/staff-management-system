<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->string('sent_by');
            $table->string('file')->nullable();
            $table->dateTime('published_at');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
