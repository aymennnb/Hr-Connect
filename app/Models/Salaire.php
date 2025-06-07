<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'employe_id',
        'mois',
        'salaire_base',
        'prime',
        'heures_sup',
        'retenue',
        'salaire_net',
        'date_traitement',
    ];

    /**
     * Relation : un salaire appartient à un employé
     */
    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}
