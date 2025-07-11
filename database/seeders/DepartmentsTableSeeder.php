<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('departments')->insert([
            ['id' => 1, 'name' => 'CSE'],
            ['id' => 2, 'name' => 'ECE'],
            ['id' => 3, 'name' => 'MECH'],
            ['id' => 4, 'name' => 'EEE'],
            ['id' => 5, 'name' => 'AIDS'],
        ]);
    }
}
