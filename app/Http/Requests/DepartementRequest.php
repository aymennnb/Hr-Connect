<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DepartementRequest extends FormRequest
{
    public function authorize()
    {
        return true; // adapte selon tes règles d'accès
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'uploaded_by' => ['required', 'exists:users,id'],
        ];
    }
}
