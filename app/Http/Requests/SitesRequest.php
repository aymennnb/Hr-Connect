<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SitesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:100', 'unique:sites,name'],
            'web' => ['nullable', 'url', 'max:200'],
            'email' => ['required', 'email', 'max:320'],
            'phone' => ['required', 'regex:/^(\+212|0)(5|6|7)[0-9]{8}$/'],
            'address' => ['required', 'string', 'max:500'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
            'ville' => ['required', 'string', 'max:100'],
            'titre_foncier' => ['nullable', 'string', 'max:100'],
            'superficie_terrain' => ['nullable', 'numeric'],
            'zoning_urbanistique' => ['nullable', 'string', 'max:255'],
            'consistance' => ['nullable', 'string'],
            'surface_gla' => ['nullable', 'numeric'],
            'uploaded_by' => ['required', 'integer'],
            'type_site' => ['required', 'in:propre,location'],

            // location fields
            'exploitant' => ['nullable', 'string', 'max:100'],
            'bailleur' => ['nullable', 'string', 'max:100'],
            'date_effet' => ['nullable', 'date'],
            'duree_bail' => ['nullable', 'string', 'max:50'],
            'loyer_actuel' => ['nullable', 'numeric'],
            'taux_revision' => ['nullable', 'numeric'],
            'prochaine_revision' => ['nullable', 'date'],

            // Totaux globaux
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

        // Si type_site == location, les champs location sont obligatoires
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
            'name.string' => 'Le nom du site doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 100 caractères.',
            'name.unique' => 'Ce nom est déjà utilisé.',

            'web.url' => 'L’URL fournie n’est pas valide.',
            'web.max' => 'L’URL ne doit pas dépasser 200 caractères.',

            'email.required' => 'L’adresse e-mail est obligatoire.',
            'email.email' => 'L’adresse e-mail doit être valide.',
            'email.max' => 'L’adresse e-mail ne doit pas dépasser 320 caractères.',

            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.regex' => 'Le numéro de téléphone doit être commencer par +212 ou 0, suivi de 5, 6 ou 7, et contenir exactement 9 chiffres après le préfixe.',

            'address.required' => 'L’adresse est obligatoire.',
            'address.max' => 'L’adresse ne doit pas dépasser 500 caractères.',

            'latitude.required' => 'La latitude est obligatoire.',
            'latitude.numeric' => 'La latitude doit être un nombre.',
            'latitude.between' => 'La latitude doit être comprise entre -90 et 90.',

            'longitude.required' => 'La longitude est obligatoire.',
            'longitude.numeric' => 'La longitude doit être un nombre.',
            'longitude.between' => 'La longitude doit être comprise entre -180 et 180.',

            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'Les formats autorisés sont : jpeg, png, jpg, gif, svg.',
            'image.max' => 'L’image ne doit pas dépasser 2 Mo.',

            'ville.required' => 'La ville est obligatoire.',
            'ville.max' => 'La ville ne doit pas dépasser 100 caractères.',

            'titre_foncier.max' => 'Le titre foncier ne doit pas dépasser 100 caractères.',

            'uploaded_by.required' => 'L’identifiant de l’utilisateur est requis.',

            'type_site.required' => 'Le type de site est requis.',
            'type_site.in' => 'Le type de site doit être "propre" ou "location".',

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
