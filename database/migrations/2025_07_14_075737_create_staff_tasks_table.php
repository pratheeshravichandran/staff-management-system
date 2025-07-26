<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_title');
            $table->text('description')->nullable();
            $table->foreignId('staff_id')->constrained('users')->onDelete('cascade');
            $table->enum('priority', ['Low', 'Medium', 'High'])->default('Medium');
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->date('due_date');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('staff_tasks');
    }
};
