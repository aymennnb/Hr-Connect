<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->string('ville');
            $table->string('titre_foncier')->nullable();
            $table->float('superficie_terrain')->nullable();
            $table->string('zoning_urbanistique')->nullable();
            $table->string('consistance')->nullable();
            $table->float('surface_gla')->nullable();
            $table->unsignedBigInteger('uploaded_by');
            $table->enum('type_site', ['propre', 'location'])->default('propre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn([
                'ville',
                'titre_foncier',
                'superficie_terrain',
                'zoning_urbanistique',
                'consistance',
                'surface_gla',
                'uploaded_by',
                'type_site',
            ]);
        });
    }
};
