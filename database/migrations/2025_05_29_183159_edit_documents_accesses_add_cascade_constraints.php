<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditDocumentsAccessesAddCascadeConstraints extends Migration
{
    public function up(): void
    {
        Schema::table('documents_accesses', function (Blueprint $table) {
            $table->dropForeign(['document_id']);
            $table->dropForeign(['user_id']);

            $table->foreign('document_id')
                ->references('id')->on('documents')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('documents_accesses', function (Blueprint $table) {
            $table->dropForeign(['document_id']);
            $table->dropForeign(['user_id']);

            $table->foreign('document_id')
                ->references('id')->on('documents');

            $table->foreign('user_id')
                ->references('id')->on('users');
        });
    }
}
