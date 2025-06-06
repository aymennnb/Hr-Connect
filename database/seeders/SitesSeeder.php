<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sites;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SitesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        // Assure qu’un dossier de stockage pour les images existe
        Storage::disk('public')->makeDirectory('sitesImages');

        for ($i = 0; $i < 15; $i++) {
            Sites::create([
                'name' => $faker->company,
                'web' => $faker->url,
                'email' => $faker->companyEmail,
                'phone' => $faker->phoneNumber,
                'address' => $faker->address,
                'latitude' => $faker->latitude(-90, 90),
                'longitude' => $faker->longitude(-180, 180),
                'image' => 'sitesImages/default.png',
            ]);
        }
    }
}
