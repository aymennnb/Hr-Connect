<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSitesfTable extends Migration
{
    public function up(): void
    {
        Schema::create('sitesf', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ville');
            $table->text('adresse');
            $table->string('titre_foncier')->nullable();
            $table->float('superficie_terrain')->nullable();
            $table->string('zoning_urbanistique')->nullable();
            $table->string('consistance')->nullable();
            $table->float('surface_gla')->nullable();
            $table->string('image')->nullable(false);
            $table->unsignedBigInteger('uploaded_by');
            $table->decimal('latitude', 18, 14);
            $table->decimal('longitude', 18, 14);
            // Stockage des surfaces détaillées en JSON (alternative à une table séparée)
            $table->json('surfaces_details')->nullable();

            // 'propre' ou 'location'
            $table->enum('type_site', ['propre', 'location'])->default('propre');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sitesf');
    }
}
