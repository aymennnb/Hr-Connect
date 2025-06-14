<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Departement extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'uploaded_by',
        'created_by',
    ];

    // Relations

    public function uploaded_by_user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function employes()
    {
        return $this->hasMany(Employe::class, 'departement_id');
    }
}
