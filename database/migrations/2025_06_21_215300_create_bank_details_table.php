<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('bank_name');
            $table->string('branch');
            $table->string('ifsc_code');
            $table->string('account_holder_name');
            $table->string('account_number');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_details');
    }
};
