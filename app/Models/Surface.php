<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Surface extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_id',
        'total',
        'vn',
        'show_room_dacia',
        'show_room_renault',
        'show_room_nouvelle_marque',
        'zone_de_preparation',
        'apv',
        'rms',
        'atelier_mecanique',
        'atelier_carrosserie',
        'vo',
        'parking',
    ];

    public function site()
    {
        return $this->belongsTo(Sites::class);
    }
}
