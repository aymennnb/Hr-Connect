<?php

namespace App\Http\Controllers;

use App\Models\Conge;
use App\Models\User;
use App\Models\Alerts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CongeController extends Controller
{
    public function index()
    {
        $conges = Conge::with('user')->latest()->get();
        return Inertia::render('Conges/IndexConges', ['conges' => $conges]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'motif' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'commentaire' => 'nullable|string',
        ]);

        $conge = Conge::create($request->all());

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'add',
            'type' => 'conge',
            'message' => "a demandé un congé (ID: {$conge->id}) du {$conge->date_debut} au {$conge->date_fin} pour le motif : {$conge->motif}"
        ]);

        return back()->with('success', 'Congé ajouté avec succès.');
    }

    public function update(Request $request, Conge $conge)
    {
        $request->validate([
            'motif' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'commentaire' => 'nullable|string',
        ]);

        $conge->update($request->all());

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'edit',
            'type' => 'conge',
            'message' => "a modifié le congé (ID: {$conge->id}) du {$conge->date_debut} au {$conge->date_fin}"
        ]);

        return back()->with('success', 'Congé modifié.');
    }

    public function accept(Conge $conge)
    {
        $conge->update(['status' => 'accepte']);

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'accept',
            'type' => 'conge',
            'message' => "a accepté le congé (ID: {$conge->id}) demandé par {$conge->user->name}"
        ]);

        return back()->with('success', 'Congé accepté.');
    }

    public function refuse(Conge $conge)
    {
        $conge->update(['status' => 'refuse']);

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'refuse',
            'type' => 'conge',
            'message' => "a refusé le congé (ID: {$conge->id}) demandé par {$conge->user->name}"
        ]);

        return back()->with('success', 'Congé refusé.');
    }

    public function destroy(Conge $conge)
    {
        $id = $conge->id;
        $nom = $conge->user->name;
        $dates = "{$conge->date_debut} → {$conge->date_fin}";

        $conge->delete();

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'delete',
            'type' => 'conge',
            'message' => "a supprimé le congé (ID: {$id}) de {$nom} prévu du {$dates}"
        ]);

        return back()->with('success', 'Congé supprimé.');
    }
}

