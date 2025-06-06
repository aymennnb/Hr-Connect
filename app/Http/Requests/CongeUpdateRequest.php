<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CongeUpdateRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'id' => 'required|exists:conges,id',
            'motif' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'commentaire' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
