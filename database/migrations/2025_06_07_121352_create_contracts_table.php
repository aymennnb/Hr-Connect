<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->enum('type_contrat', ['CDI', 'CDD', 'Stage', 'Alternance', 'Interim']);
            $table->string('titre');
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            
            $table->decimal('salaire_mensuel', 10, 2);
            $table->decimal('taux_horaire', 8, 2);
            $table->decimal('taux_heures_supp', 8, 2);
            $table->decimal('montant_fixe', 10, 2);
            $table->enum('mode_paiement', ['mensuel', 'horaire', 'forfaitaire']);

            $table->foreignId('employe_id')->constrained()->onDelete('cascade');
            $table->string('document_path')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->index('employe_id');
        });
    }

    public function down(): void {
        Schema::dropIfExists('contracts');
    }
};