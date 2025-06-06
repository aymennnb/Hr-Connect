<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('employes', function (Blueprint $table) {
            $table->id();
            
            // Clé étrangère vers users
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Clé étrangère vers departements
            $table->unsignedBigInteger('departement_id')->nullable();
            $table->foreign('departement_id')->references('id')->on('departements')->onDelete('set null');

            // Informations générales
            $table->string('matricule')->unique();
            $table->string('poste')->nullable();
            $table->date('date_embauche')->nullable();
            $table->string('telephone')->nullable();
            $table->string('adresse')->nullable();
            $table->date('date_naissance')->nullable();
            $table->string('ville')->nullable();
            $table->string('etat_civil')->nullable();
            $table->string('genre')->nullable();
            $table->string('photo')->nullable();

            // Infos administratives
            $table->string('cnss')->nullable();
            $table->string('cin')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('employes');
    }
};
