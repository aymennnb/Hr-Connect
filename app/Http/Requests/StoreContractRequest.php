<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContractRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'employe_id' => 'required|exists:employes,id',
            'type_contrat' => [
                'required',
                Rule::in(['CDI', 'CDD', 'Stage', 'Alternance', 'Interim'])
            ],
            'reference' => 'required|string|max:50|unique:contracts,reference',
            'date_debut' => 'required|date|after_or_equal:today',
            'date_fin' => [
                'nullable',
                'date',
                Rule::requiredIf(function () {
                    return in_array($this->type_contrat, ['CDD', 'Stage', 'Alternance', 'Interim']);
                }),
                'after:date_debut'
            ],
            'titre' => 'required|string|max:100',
            'mode_paiement' => [
                'required',
                Rule::in(['mensuel', 'horaire', 'forfaitaire'])
            ],
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ];

        // Règles conditionnelles selon le mode de paiement
        switch ($this->input('mode_paiement')) {
            case 'mensuel':
                $rules['salaire_mensuel'] = ['required', 'numeric', 'min:0'];
                break;

            case 'horaire':
                $rules['taux_horaire'] = ['required', 'numeric', 'min:0'];
                $rules['taux_heures_supp'] = ['required', 'numeric', 'min:0'];
                break;

            case 'forfaitaire':
                $rules['montant_fixe'] = ['required', 'numeric', 'min:0'];
                break;
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // Messages généraux
            'employe_id.required' => 'L\'employé est obligatoire',
            'employe_id.exists' => 'L\'employé sélectionné n\'existe pas',
            
            // Messages pour le contrat
            'type_contrat.required' => 'Le type de contrat est obligatoire',
            'type_contrat.in' => 'Le type de contrat sélectionné est invalide',
            
            'reference.required' => 'La référence du contrat est obligatoire',
            'reference.unique' => 'Cette référence de contrat est déjà utilisée',
            'reference.max' => 'La référence ne doit pas dépasser 50 caractères',
            
            'date_debut.required' => 'La date de début est obligatoire',
            'date_debut.after_or_equal' => 'La date de début ne peut pas être antérieure à aujourd\'hui',
            
            'date_fin.required' => 'La date de fin est obligatoire pour ce type de contrat',
            'date_fin.after' => 'La date de fin doit être postérieure à la date de début',
            
            'titre.required' => 'Le titre du poste est obligatoire',
            'titre.max' => 'Le titre du poste ne doit pas dépasser 100 caractères',
            
            'mode_paiement.required' => 'Le mode de paiement est obligatoire',
            'mode_paiement.in' => 'Le mode de paiement sélectionné est invalide',
            
            // Messages pour les modes de paiement
            'salaire_mensuel.required' => 'Le salaire mensuel est requis pour ce mode de paiement',
            'salaire_mensuel.numeric' => 'Le salaire mensuel doit être un nombre',
            'salaire_mensuel.min' => 'Le salaire mensuel ne peut pas être négatif',
            
            'taux_horaire.required' => 'Le taux horaire est requis pour ce mode de paiement',
            'taux_horaire.numeric' => 'Le taux horaire doit être un nombre',
            'taux_horaire.min' => 'Le taux horaire ne peut pas être négatif',
            
            'taux_heures_supp.required' => 'Le taux des heures supplémentaires est requis pour ce mode de paiement',
            'taux_heures_supp.numeric' => 'Le taux des heures supplémentaires doit être un nombre',
            'taux_heures_supp.min' => 'Le taux des heures supplémentaires ne peut pas être négatif',
            
            'montant_fixe.required' => 'Le montant fixe est requis pour ce mode de paiement',
            'montant_fixe.numeric' => 'Le montant fixe doit être un nombre',
            'montant_fixe.min' => 'Le montant fixe ne peut pas être négatif',
            
            // Messages pour le document
            'document.file' => 'Le document doit être un fichier valide',
            'document.mimes' => 'Le document doit être de type: pdf, doc ou docx',
            'document.max' => 'Le document ne doit pas dépasser 5 Mo',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'type_contrat' => 'type de contrat',
            'date_debut' => 'date de début',
            'date_fin' => 'date de fin',
            'mode_paiement' => 'mode de paiement',
            'salaire_mensuel' => 'salaire mensuel',
            'taux_horaire' => 'taux horaire',
            'taux_heures_supp' => 'taux heures supplémentaires',
            'montant_fixe' => 'montant fixe',
        ];
    }
}