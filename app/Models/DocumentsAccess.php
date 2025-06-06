<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentsAccess extends Model
{
    protected $fillable = [
        'document_id',
        'user_id',
        'created_at',
        'updated_at'
    ];

    // Définition de la relation avec le modèle User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Assure-toi que c'est 'user_id'
    }

    // Définition de la relation avec le modèle Documents
    public function document()
    {
        return $this->belongsTo(Documents::class, 'document_id'); // Assure-toi que c'est 'document_id'
    }
}
