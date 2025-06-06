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
    Schema::create('sites', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('web')->nullable();
        $table->string('email');
        $table->string('phone');
        $table->string('address');
        $table->decimal('latitude', 18, 14);
        $table->decimal('longitude', 18, 14);
        $table->string('image')->nullable(false);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};
