<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateDocumentsAccessesForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Modifie les clés étrangères pour ajouter la suppression en cascade
        Schema::table('documents_accesses', function (Blueprint $table) {
            $table->dropForeign(['document_id']); // Supprime la clé étrangère existante
            $table->dropForeign(['user_id']); // Supprime la clé étrangère existante

            // Ajoute les clés étrangères avec la suppression en cascade
            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Revert the changes (drop foreign keys and add the original ones)
        Schema::table('documents_accesses', function (Blueprint $table) {
            $table->dropForeign(['document_id']);
            $table->dropForeign(['user_id']);

            $table->foreign('document_id')->references('id')->on('documents');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }
}
