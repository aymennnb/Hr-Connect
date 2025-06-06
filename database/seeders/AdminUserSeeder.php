<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::where('role', 'founder')->delete();

        User::create([
            'name' => 'Fondateur',
            'email' => 'admin@m-automotiv@gmail.ma',
            'password' => Hash::make('admin12@34@'),
            'role' => 'superadmin',
        ]);
    }
}
