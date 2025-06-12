<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddUseremploye extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'email' => [
                'required',
                'email',
                'max:255',
            ],
            'departement_id' => 'nullable|exists:departements,id',
            'matricule' => 'required|unique:employes,matricule',
            'poste' => 'required|string|max:100',
            'date_embauche' => 'required|date|after_or_equal:today',
            'telephone' => [
                'required',
                'string',
                'max:20',
                'regex:/^(?:\+212|0)([5-7]\d{8})$/'
            ],
            'adresse' => 'required|string|max:255',
            'date_naissance' => 'required|date|before:today',
            'ville' => 'nullable|string|max:100',
            'etat_civil' => 'nullable|in:celibataire,marie,divorce,veuf',
            'genre' => 'required|in:H,F',
            'cnss' => 'required|string|max:50|unique:employes,cnss|regex:/^[0-9]+$/',
            'cin' => 'required|string|max:50|unique:employes,cin',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

            'contract_reference' => 'required|string|max:50|unique:contracts,reference',
            'contract_type' => 'required|in:CDI,CDD,Stage,Alternance,Interim',
            'contract_titre' => 'required|string|max:100',
            'contract_date_debut' => 'required|date',
            'contract_date_fin' => [
                'nullable',
                'date',
                Rule::requiredIf(function () {
                    return in_array($this->contract_type, ['CDD', 'Stage', 'Alternance', 'Interim']);
                }),
                'after:contract_date_debut'
            ],
            'contract_mode_paiement' => 'required|in:mensuel,horaire,forfaitaire',
            'contract_document_path' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ];

        switch ($this->input('contract_mode_paiement')) {
            case 'mensuel':
                $rules['contract_salaire_mensuel'] = ['required', 'numeric'];
                break;

            case 'horaire':
                $rules['contract_taux_horaire'] = ['required', 'numeric'];
                $rules['contract_taux_heures_supp'] = ['required', 'numeric'];
                break;

            case 'forfaitaire':
                $rules['contract_montant_fixe'] = ['required', 'numeric'];
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
            // Messages utilisateur
            'name.required' => 'Le nom complet est obligatoire',
            'email.required' => 'L\'email est obligatoire',
            'email.unique' => 'Cet email est déjà utilisé par un autre utilisateur',
            'password.required' => 'Le mot de passe est obligatoire',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères',
            'role.required' => 'Le rôle est obligatoire',
            'role.in' => 'Le rôle sélectionné est invalide',

            // Messages employé
            'matricule.required' => 'Le matricule est obligatoire',
            'matricule.unique' => 'Ce matricule est déjà utilisé',
            'poste.required' => 'Le poste est obligatoire',
            'date_embauche.required' => 'La date d\'embauche est obligatoire',
            'date_embauche.after_or_equal' => "La date d'embauche ne peut pas être antérieure à aujourd'hui",
            'telephone.required' => 'Le numéro de téléphone est obligatoire',
            'telephone.regex' => 'Le numéro de téléphone doit être un numéro marocain valide (ex: +212612345678 ou 0612345678)',
            'adresse.required' => 'L\'adresse est obligatoire',
            'date_naissance.required' => 'La date de naissance est obligatoire',
            'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui',
            'genre.required' => 'Le genre est obligatoire',
            'genre.in' => 'Le genre sélectionné est invalide',
            'cnss.required' => 'Le numéro CNSS est obligatoire',
            'cnss.regex' => 'Le numéro CNSS ne doit contenir que des chiffres',
            'cnss.unique' => 'Ce numéro CNSS est déjà utilisé par un autre employé',
            'cin.required' => 'Le CIN est obligatoire',
            'cin.unique' => 'Ce CIN est déjà utilisé par un autre employé',
            'photo.image' => 'Le fichier doit être une image valide',
            'photo.mimes' => 'L\'image doit être de type: jpeg, png, jpg ou gif',
            'photo.max' => 'L\'image ne doit pas dépasser 2 Mo',

            // Messages pour le contrat
            'contract_reference.required' => 'La référence du contrat est obligatoire',
            'contract_reference.unique' => 'Cette référence de contrat est déjà utilisée',
            'contract_type.required' => 'Le type de contrat est obligatoire',
            'contract_titre.required' => 'Le titre du poste est obligatoire',
            'contract_date_debut.required' => 'La date de début est obligatoire',
            'contract_date_fin.after' => 'La date de fin doit être postérieure à la date de début',
            'contract_salaire_mensuel.required' => 'Le salaire mensuel est requis pour ce mode de paiement',
            'contract_taux_horaire.required' => 'Le taux horaire est requis pour ce mode de paiement',
            'contract_taux_heures_supp.required' => 'Le taux des heures supplémentaires est requis pour ce mode de paiement',
            'contract_montant_fixe.required' => 'Le montant fixe est requis pour ce mode de paiement',
            'contract_mode_paiement.required' => 'Le mode de paiement est obligatoire',
            'contract_document_path.file' => 'Le document doit être un fichier valide',
            'contract_document_path.mimes' => 'Le document doit être de type: pdf, doc ou docx',
            'contract_document_path.max' => 'Le document ne doit pas dépasser 5 Mo',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Nettoyage des numéros de téléphone et CNSS
        $this->merge([
            'telephone' => $this->telephone ? preg_replace('/[^0-9+]/', '', $this->telephone) : null,
            'cnss' => $this->cnss ? preg_replace('/[^0-9]/', '', $this->cnss) : null,
        ]);
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'nom complet',
            'departement_id' => 'département',
            'date_embauche' => 'date d\'embauche',
            'date_naissance' => 'date de naissance',
            'etat_civil' => 'état civil',
        ];
    }
}