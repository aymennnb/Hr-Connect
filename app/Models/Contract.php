<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reference',
        'type_contrat',
        'titre',
        'date_debut',
        'date_fin',
        'salaire_mensuel',
        'taux_horaire',
        'taux_heures_supp',
        'montant_fixe',
        'mode_paiement',
        'employe_id',
        'document_path',
        'created_by'
    ];

    /**
     * Get the employee associated with the contract.
     */
    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }

    /**
     * Get the user who created the contract.
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include active contracts.
     */
    public function scopeActive($query)
    {
        return $query->where('statut', 'actif');
    }

    /**
     * Scope a query to only include expired contracts.
     */
    public function scopeExpired($query)
    {
        return $query->where('statut', 'expire');
    }
}