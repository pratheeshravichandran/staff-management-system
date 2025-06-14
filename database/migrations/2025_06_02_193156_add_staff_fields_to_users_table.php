<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->enum('status', ['Active', 'Inactive', 'On Leave', 'Resigned'])->default('Active')->before('created_at');
        $table->date('joining_date')->nullable()->before('created_at');
        $table->text('address')->nullable()->before('created_at');
        $table->decimal('salary', 10, 2)->nullable()->before('created_at');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['status', 'joining_date', 'address', 'salary']);
    });
}

};
