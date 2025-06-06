<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaireController extends Controller
{
    public function index()
    {
        return Inertia::render('Salaires/IndexSalaires');
    }
}
