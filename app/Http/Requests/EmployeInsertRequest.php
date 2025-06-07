<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeInsertRequest extends FormRequest
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
        return [
            'name' => 'required|string|max:255|unique:users,name',
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email'
            ],
            'password' => 'required|string|min:8',
            'role' => 'required|in:user,manager,admin',
            
            'departement_id' => 'nullable|exists:departements,id',
            'matricule' => 'required|unique:employes,matricule',
            'poste' => 'required|string|max:100',
            'date_embauche' => 'required|date|before_or_equal:today',
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
            'cnss' => 'required|string|max:50|regex:/^[0-9]+$/',
            'cin' => 'required|string|max:50',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
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
            'date_embauche.before_or_equal' => 'La date d\'embauche ne peut pas être dans le futur',
            'telephone.required' => 'Le numéro de téléphone est obligatoire',
            'telephone.regex' => 'Le numéro de téléphone doit être un numéro marocain valide (ex: +212612345678 ou 0612345678)',
            'adresse.required' => 'L\'adresse est obligatoire',
            'date_naissance.required' => 'La date de naissance est obligatoire',
            'date_naissance.before' => 'La date de naissance doit être antérieure à aujourd\'hui',
            'genre.required' => 'Le genre est obligatoire',
            'genre.in' => 'Le genre sélectionné est invalide',
            'cnss.required' => 'Le numéro CNSS est obligatoire',
            'cnss.regex' => 'Le numéro CNSS ne doit contenir que des chiffres',
            'cin.required' => 'Le CIN est obligatoire',
            'photo.image' => 'Le fichier doit être une image valide',
            'photo.mimes' => 'L\'image doit être de type: jpeg, png, jpg ou gif',
            'photo.max' => 'L\'image ne doit pas dépasser 2 Mo',
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