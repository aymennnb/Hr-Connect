<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class DocumentSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Générer 10 documents
        for ($i = 0; $i < 10; $i++) {
            DB::table('documents')->insert([
                'title' => $faker->sentence, // Titre aléatoire
                'description' => $faker->paragraph, // Description aléatoire
                'file_path' => 'documents/' . $faker->uuid . '.pdf', // Exemple de chemin de fichier
                'site_id' => rand(1, 5), // Site ID aléatoire entre 1 et 5
                'uploaded_by' => rand(1, 10), // L'ID de l'utilisateur qui a téléchargé (par exemple un ID entre 1 et 10)
            ]);
        }
    }
}
