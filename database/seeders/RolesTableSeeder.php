<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('roles')->insert([
            ['id' => 1, 'role_name' => 'Admin'],
            ['id' => 2, 'role_name' => 'HR'],
            ['id' => 3, 'role_name' => 'Staff'],
            ['id' => 4, 'role_name' => 'Manager'],
            ['id' => 5, 'role_name' => 'Student'],
        ]);
    }
}
