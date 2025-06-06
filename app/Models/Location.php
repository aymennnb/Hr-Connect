<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $table = 'locations';

    protected $fillable = [
        'sitef_id',
        'exploitant',
        'bailleur',
        'date_effet',
        'duree_bail',
        'loyer_actuel',
        'taux_revision',
        'prochaine_revision',
    ];

    protected $casts = [
        'date_effet' => 'date',
        'prochaine_revision' => 'date',
    ];

    public function sitef()
    {
        return $this->belongsTo(Sitef::class, 'sitef_id');
    }
}
