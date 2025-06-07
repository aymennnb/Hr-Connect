<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContratsController extends Controller
{
    public function index()
    {
        $contrats = Contract::all();
        return Inertia::render('Contrats/IndexContrats');
    }
}
