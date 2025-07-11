<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Faker\Factory as Faker;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // 1️⃣ Create single Admin user
        DB::table('users')->insert([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password123'), // set strong password
            'role' => 1, // admin
            'status' => 'Active',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // 2️⃣ Create 24 users for roles 2 (hr) to 5 (student)
        $users = [];
        for ($i = 1; $i <= 24; $i++) {
            $roleId = $faker->numberBetween(2, 5); // Exclude admin (1)

            $users[] = [
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'staff_id' => $roleId != 5 ? strtoupper('STF' . $i . rand(100, 999)) : null,
                'dob' => $faker->date('Y-m-d', '2004-01-01'),
                'designation' => $roleId != 5 ? $faker->jobTitle : null,
                'gender' => $faker->randomElement(['Male', 'Female', 'Other']),
                'email' => $faker->unique()->safeEmail,
                'phone_number' => $faker->phoneNumber,
                'password' => Hash::make('password123'), // default password
                'profile_pic' => null,
                'role' => $roleId,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'department_id' => $faker->numberBetween(1, 4),
                'status' => $faker->randomElement(['Active', 'Inactive', 'On Leave', 'Resigned']),
                'joining_date' => $faker->date(),
                'address' => $faker->address,
                'salary' => $roleId != 5 ? $faker->randomFloat(2, 20000, 90000) : null,
            ];
        }

        DB::table('users')->insert($users);
    }
}
