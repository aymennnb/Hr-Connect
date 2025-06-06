<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'site_id' => ['required', 'exists:sites,id'],
            'uploaded_by' => ['required', 'exists:users,id'],
            'expiration_date' => ['nullable', 'date', 'after_or_equal:today'],
            'document_type' => ['required', 'in:urbanisme,contrat,fiscalite,autre'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',

            'description.string' => 'La description doit être une chaîne de caractères valide.',

            'site_id.required' => 'Le site est obligatoire.',
            'site_id.exists' => 'Le site sélectionné est invalide.',

            'uploaded_by.required' => 'L\'utilisateur qui télécharge est obligatoire.',
            'uploaded_by.exists' => 'L\'utilisateur sélectionné est invalide.',

            'expiration_date.date' => 'La date d\'expiration doit être une date valide.',
            'expiration_date.after_or_equal' => 'La date d\'expiration doit être aujourd\'hui ou une date future.',

            'document_type.required' => 'Le type de document est obligatoire.',
            'document_type.in' => 'Le type de document est invalide.',
        ];
    }
}
