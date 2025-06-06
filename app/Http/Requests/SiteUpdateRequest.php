<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SiteUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:100'],
            'web' => ['nullable', 'url', 'max:150'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['required', 'regex:/^(\+212|0)(5|6|7)[0-9]{8}$/'],
            'address' => ['required', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'ville' => ['required', 'string', 'max:100'],
            'titre_foncier' => ['nullable', 'string', 'max:100'],
            'superficie_terrain' => ['nullable', 'numeric'],
            'zoning_urbanistique' => ['nullable', 'string', 'max:100'],
            'consistance' => ['nullable', 'string', 'max:1000'],
            'surface_gla' => ['nullable', 'numeric'],
            'type_site' => ['required', 'in:propre,location'],

            // Location
            'exploitant' => ['nullable', 'string', 'max:100'],
            'bailleur' => ['nullable', 'string', 'max:100'],
            'date_effet' => ['nullable', 'date'],
            'duree_bail' => ['nullable', 'string', 'max:50'],
            'loyer_actuel' => ['nullable', 'numeric'],
            'taux_revision' => ['nullable', 'numeric'],
            'prochaine_revision' => ['nullable', 'date'],

            // Surfaces
            'total' => ['nullable', 'numeric'],
            'vo' => ['nullable', 'numeric'],
            'parking' => ['nullable', 'numeric'],

            // Zone VN
            'vn.total' => ['nullable', 'numeric'],
            'vn.show_room_dacia' => ['nullable', 'numeric'],
            'vn.show_room_renault' => ['nullable', 'numeric'],
            'vn.show_room_nouvelle_marque' => ['nullable', 'numeric'],
            'vn.zone_de_preparation' => ['nullable', 'numeric'],

            // Zone APV
            'apv.total' => ['nullable', 'numeric'],
            'apv.rms' => ['nullable', 'numeric'],
            'apv.atelier_mecanique' => ['nullable', 'numeric'],
            'apv.atelier_carrosserie' => ['nullable', 'numeric'],
        ];

        // Règles obligatoires si type_site = location
        if ($this->input('type_site') === 'location') {
            $rules['exploitant'] = ['required', 'string', 'max:100'];
            $rules['bailleur'] = ['required', 'string', 'max:100'];
            $rules['date_effet'] = ['required', 'date'];
            $rules['duree_bail'] = ['required', 'string', 'max:50'];
            $rules['loyer_actuel'] = ['required', 'numeric'];
            $rules['taux_revision'] = ['required', 'numeric'];
            $rules['prochaine_revision'] = ['required', 'date', 'after:date_effet'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du site est obligatoire.',
            'name.max' => 'Le nom du site ne doit pas dépasser 100 caractères.',

            'web.url' => 'Le champ web doit contenir une URL valide.',
            'web.max' => 'L\'URL ne doit pas dépasser 150 caractères.',

            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'L\'adresse email doit être valide.',
            'email.max' => 'L\'adresse email ne doit pas dépasser 150 caractères.',

            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.regex' => 'Le numéro de téléphone doit être commencer par +212 ou 0, suivi de 5, 6 ou 7, et contenir exactement 9 chiffres après le préfixe.',

            'address.required' => 'L\'adresse est obligatoire.',
            'address.max' => 'L\'adresse ne doit pas dépasser 255 caractères.',

            'latitude.required' => 'La latitude est obligatoire.',
            'latitude.numeric' => 'La latitude doit être un nombre.',
            'latitude.between' => 'La latitude doit être comprise entre -90 et 90.',

            'longitude.required' => 'La longitude est obligatoire.',
            'longitude.numeric' => 'La longitude doit être un nombre.',
            'longitude.between' => 'La longitude doit être comprise entre -180 et 180.',

            'ville.required' => 'La ville est obligatoire.',
            'ville.max' => 'Le nom de la ville ne doit pas dépasser 100 caractères.',

            'type_site.required' => 'Le type du site est obligatoire.',
            'type_site.in' => 'Le type du site doit être soit propriété, soit location.',

            'exploitant.required' => 'Le nom de l’exploitant est requis pour un site en location.',
            'bailleur.required' => 'Le nom du bailleur est requis pour un site en location.',
            'date_effet.required' => 'La date d’effet du bail est requise.',
            'duree_bail.required' => 'La durée du bail est requise.',
            'loyer_actuel.required' => 'Le montant du loyer est requis.',
            'taux_revision.required' => 'Le taux de révision est requis.',
            'prochaine_revision.required' => 'La date de la prochaine révision est requise.',
            'prochaine_revision.after' => 'La prochaine révision doit être postérieure à la date d’effet.',
        ];
    }
}
