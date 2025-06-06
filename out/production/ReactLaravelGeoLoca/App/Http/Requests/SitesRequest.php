<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SitesRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:sites,name'],
            'web'       => ['nullable', 'url', 'max:255'],
            'email'     => ['required', 'email', 'max:255'],
            'phone'     => ['required', 'string', 'max:20'],
            'address'   => ['required', 'string', 'max:500'],
            'latitude'  => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'image'     => ['required', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        ];
    }
}
