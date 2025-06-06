<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sites extends Model
{
    protected $fillable = [
        'name',
        'web',
        'email',
        'phone',
        'address',
        'latitude',
        'longitude',
        'image',
        'ville',
        'titre_foncier',
        'superficie_terrain',
        'zoning_urbanistique',
        'consistance',
        'surface_gla',
        'uploaded_by',
        'type_site',
        'created_at',
        'updated_at'
    ];
}
