<?php

namespace App\Models;

use Carbon\Carbon;
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
        $today = Carbon::today();
        return $query->where('date_debut', '<=', $today)
                     ->where(function($q) use ($today) {
                         $q->whereNull('date_fin')
                           ->orWhere('date_fin', '>=', $today);
                     });
    }

    // Scope pour les contrats expirés
    public function scopeExpired($query)
    {
        return $query->whereNotNull('date_fin')
                     ->where('date_fin', '<', Carbon::today());
    }

    // Accessor pour le statut
    public function getStatutAttribute()
    {
        $today = Carbon::today();
        
        if ($this->date_debut > $today) {
            return 'future';
        }
        
        if (is_null($this->date_fin) || $this->date_fin >= $today) {
            return 'actif';
        }
        
        return 'expire';
    }
}