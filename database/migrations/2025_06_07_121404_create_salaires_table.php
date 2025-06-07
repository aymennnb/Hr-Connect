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
        Schema::create('salaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained('employes')->onDelete('cascade');
            $table->string('mois');
            $table->decimal('salaire_base', 10, 2)->default(0);
            $table->decimal('prime', 10, 2)->default(0);
            $table->decimal('heures_sup', 10, 2)->default(0);
            $table->decimal('retenue', 10, 2)->default(0);
            $table->decimal('salaire_net', 10, 2)->default(0);
            $table->dateTime('date_traitement');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salaires');
    }
};
