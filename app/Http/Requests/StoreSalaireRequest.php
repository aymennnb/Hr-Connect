<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class StoreSalaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'employe_id' => 'required|exists:employes,id',
            'mois' => 'required',
            'prime' => 'required|numeric|min:0',
            'retenue' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:mensuel,horaire,forfaitaire',
            'salaire_base' => 'required|numeric|min:0',
        ];

        switch($this->input('mode_paiement')) {
            case 'mensuel':
                $rules['salaire_mensuel'] = 'required|numeric|min:0';
                break;

            case 'horaire':
                $rules['taux_horaire'] = 'required|numeric|min:0';
                $rules['taux_heures_supp'] = 'required|numeric|min:0';
                $rules['heures_sup'] = 'required|numeric|min:0';
                break;

            case 'forfaitaire':
                $rules['montant_fixe'] = 'required|numeric|min:0';
                break;
        }

        return $rules;
    }

    protected function prepareForValidation()
    {
        // Convertit le format Y-m en date complète pour la validation
        $this->merge([
            'mois' => $this->mois ? $this->mois . '-01' : null,
        ]);
    }

    public function messages(): array
    {
        return [
            'employe_id.required' => 'La sélection d\'un employé est obligatoire',
            'mois.required' => 'Le mois est obligatoire',
            'salaire_base.required' => 'Le salaire de base est obligatoire',
            'salaire_base.same' => 'Le salaire de base doit correspondre au montant du contrat',
            'prime.required' => 'La prime est obligatoire',
            'retenue.required' => 'Les retenues sont obligatoires',
            'salaire_mensuel.required' => 'Le salaire mensuel est obligatoire pour ce mode de paiement',
            'taux_horaire.required' => 'Le taux horaire est obligatoire pour ce mode de paiement',
            'taux_heures_supp.required' => 'Le taux des heures supplémentaires est obligatoire',
            'heures_sup.required' => 'Le nombre d\'heures supplémentaires est obligatoire',
            'montant_fixe.required' => 'Le montant fixe est obligatoire pour ce mode de paiement',
            '*.numeric' => 'Ce champ doit être un nombre',
            '*.min' => 'Ce champ ne peut pas être négatif',
        ];
    }
}