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
        Schema::create('surfaces', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('site_id');
            $table->float('total')->nullable();
            $table->float('vn')->nullable();
            $table->float('show_room_dacia')->nullable();
            $table->float('show_room_renault')->nullable();
            $table->float('show_room_nouvelle_marque')->nullable();
            $table->float('zone_de_preparation')->nullable();
            $table->float('apv')->nullable();
            $table->float('rms')->nullable();
            $table->float('atelier_mecanique')->nullable();
            $table->float('atelier_carrosserie')->nullable();
            $table->float('vo')->nullable();
            $table->float('parking')->nullable();
            $table->timestamps();

            $table->foreign('site_id')->references('id')->on('sites')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surfaces_details');
    }
};
