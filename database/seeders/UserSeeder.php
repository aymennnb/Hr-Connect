<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@hr-connect.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create HR manager
        User::create([
            'name' => 'Responsable RH',
            'email' => 'manager@hr-connect.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
            'email_verified_at' => now(),
        ]);

        // Create regular employee
        User::create([
            'name' => 'Employé',
            'email' => 'employe@hr-connect.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);
    }
}
