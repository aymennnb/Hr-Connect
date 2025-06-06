<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'departement_id',
        'matricule',
        'poste',
        'date_embauche',
        'telephone',
        'adresse',
        'date_naissance',
        'ville',
        'etat_civil',
        'genre',
        'cnss',
        'cin',
        'photo',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }
}
