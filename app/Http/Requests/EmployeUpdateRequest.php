<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $employe = $this->route('employe');

        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($employe->user_id) 
            ],
            'role' => 'required|in:user,manager,admin',
            'departement_id' => 'nullable|exists:departements,id',
            'matricule' => 'required|string|max:50',
            'poste' => 'required|string|max:255',
            'date_embauche' => 'required|date',
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'ville' => 'required|string|max:100',
            'etat_civil' => 'required|in:celibataire,marie,divorce,veuf',
            'genre' => 'required|in:H,F',
            'cnss' => 'required|string|max:50',
            'cin' => 'required|string|max:50',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'email.unique' => 'Cet email est déjà utilisé par un autre utilisateur',
            'required' => 'Le champ :attribute est obligatoire',
            'date' => 'Le champ :attribute doit être une date valide',
        ];
    }
}