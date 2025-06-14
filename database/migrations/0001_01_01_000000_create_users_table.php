<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Roles table
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('role_name', 50)->unique();
            $table->timestamps();
        });

        // 2. Users table (without department_id for now)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 255);
            $table->string('last_name', 255)->nullable();
            $table->string('staff_id', 50)->unique()->nullable();
            $table->date('dob')->nullable();
            $table->string('designation')->nullable()->comment('Only for staff');
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->string('email', 255)->unique();
            $table->string('phone_number')->unique()->nullable();
            $table->string('password', 255)->nullable();
            $table->string('profile_pic')->nullable();
            $table->foreignId('role')->constrained('roles')->onDelete('cascade');
            $table->timestamps();
        });

        // 3. Departments table (can reference users now)
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->foreignId('hod_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 4. Now add department_id to users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
        });

        // 5. Password reset tokens
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // 6. Verifications
        Schema::create('verifications', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('otp', 6)->nullable();
            $table->string('email_token')->nullable();
            $table->boolean('phone_verified')->default(false);
            $table->boolean('email_verified')->default(false);
            $table->string('verification_token')->nullable();
            $table->timestamp('otp_expires_at')->nullable();
            $table->timestamp('email_token_expires_at')->nullable();
            $table->timestamps();
        });

        // 7. Sessions
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('verifications');
        Schema::dropIfExists('password_reset_tokens');

        // Remove department_id first to avoid dependency
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');
        });

        Schema::dropIfExists('departments');
        Schema::dropIfExists('users');
        Schema::dropIfExists('roles');
    }
};
