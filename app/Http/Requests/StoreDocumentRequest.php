<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
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
            
            'file_path' => ['required', 'file', 'mimes:pdf,doc,docx,xls,csv,xlsx,png,jpg,jpeg', 'max:20480'],
            'expiration_date' => ['nullable', 'date', 'after_or_equal:today'],
            'document_type' => ['required', 'in:urbanisme,contrat,fiscalite,autre'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',
            'title.string' => 'Le titre doit être une chaîne de caractères.',

            'description.string' => 'La description doit être une chaîne de caractères valide.',

            'site_id.required' => 'Le site est obligatoire.',
            'site_id.exists' => 'Le site sélectionné est invalide.',

            'uploaded_by.required' => 'L\'utilisateur qui télécharge est obligatoire.',
            'uploaded_by.exists' => 'L\'utilisateur sélectionné est invalide.',

            'file_path.required' => 'Le fichier est obligatoire.',
            'file_path.file' => 'Le fichier doit être un fichier valide.',
            'file_path.mimes' => 'Le fichier doit être au format : pdf, doc, docx, xls, csv, xlsx, png, jpg ou jpeg.',
            'file_path.max' => 'La taille du fichier ne doit pas dépasser 20 Mo.',

            'expiration_date.date' => 'La date d\'expiration doit être une date valide.',
            'expiration_date.after_or_equal' => 'La date d\'expiration doit être aujourd\'hui ou une date future.',

            'document_type.required' => 'Le type de document est obligatoire.',
            'document_type.in' => 'Le type de document est invalide.',
        ];
    }
}
