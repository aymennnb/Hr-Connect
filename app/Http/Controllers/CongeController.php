<?php

namespace App\Http\Controllers;

use App\Http\Requests\CongeRequest;
use App\Http\Requests\CongeUpdateRequest;
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
        $currentUser = Auth::user();

        if ($currentUser->role === 'superadmin') {
            $conges = Conge::with('user')->latest()->get();
        } elseif ($currentUser->role === 'admin') {
            $conges = Conge::with('user')
                ->whereHas('user', function ($query) {
                    $query->whereIn('role', ['manager', 'user']);
                })
                ->latest()
                ->get();
        } elseif ($currentUser->role === 'manager') {
            $conges = Conge::with('user')
                ->whereHas('user', function ($query) {
                    $query->where('role', 'user');
                })
                ->latest()
                ->get();
        } else {
            $conges = collect();
        }

        return Inertia::render('Conges/IndexConges', ['conges' => $conges]);
    }

    public function store(CongeRequest $request)
    {
        $validated = $request->validated();

        $conge = new Conge();

        $conge->user_id = Auth::id();
        $conge->motif = $validated['motif'];
        $conge->date_debut = $validated['date_debut'];
        $conge->date_fin = $validated['date_fin'];
        $conge->commentaire = $validated['commentaire'] ?? null;

        $conge->save();

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'add',
            'type' => 'conges',
            'message' => "a demandé un congé du {$conge->date_debut} au {$conge->date_fin}",
        ]);

        return redirect()->route('conges.public')->with(['success'=> 'Demande de congé enregistrée avec succès']);
    }

    public function update(CongeUpdateRequest $request)
    {
        $item = Conge::find($request->id);

        if (!$item) {
            return redirect()->route('conges')->with(['error' => 'Congé non trouvé']);
        }

        $item->motif = $request->motif;
        $item->date_debut = $request->date_debut;
        $item->date_fin = $request->date_fin;
        $item->commentaire = $request->commentaire;
        $item->user_id = $request->user_id;
        $item->save();

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'update',
            'type' => 'conges',
            'message' => "a modifié les informations d'un congé avec l'ID {$item->id}",
        ]);

        return redirect()->route('conges.public')->with(['success' => 'Le congé a été mis à jour avec succès']);
    }

    public function accept($id)
    {
        $conge = Conge::findOrFail($id);
        $conge->update(['status' => 'accepte']);

        $user = User::find($conge->user_id);
        $userName = $user?->name ?? 'Utilisateur inconnu';

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'accept',
            'type' => 'conges',
            'message' => "a accepté le congé demandé par {$userName} dont l'ID est {$conge->id}"
        ]);

        return redirect()->route('conges')->with(['success'=> 'Congé accepté avec succès']);
    }

    public function refuse($id)
    {
        $conge = Conge::findOrFail($id);
        $conge->update(['status' => 'refuse']);

        $user = User::find($conge->user_id);
        $userName = $user?->name ?? 'Utilisateur inconnu';

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'refuse',
            'type' => 'conges',
            'message' => "a refusé le congé demandé par {$userName} dont l'ID est {$conge->id}"
        ]);

        return redirect()->route('conges')->with(['success'=> 'Congé refusé avec succès']);
    }

    public function delete($id)
    {
        $conge = Conge::where('id', $id)->first();

        if (!$conge) {
            return redirect()->route('conges.public')->with(['error' => 'Congé non trouvé']);
        }

        if ($conge->user_id !== auth()->id()) {
            abort(403);
        }

        $conge->delete();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'conges',
            'message' => "a annulé une demande de congé du {$conge->date_debut} au {$conge->date_fin} dont l'ID est {$conge->id}",
        ]);

        return redirect()->route('conges.public')->with(['success' => "Le congé a été annulé avec succès"]);
    }

    public function indexpublic() 
    {
        $user = auth()->user();
        $employe = $user->employe;
        
        $hasActiveContract = false;
        if ($employe) {
            $hasActiveContract = $employe->contrats()
                ->where('date_debut', '<=', now())
                ->where(function($query) {
                    $query->where('date_fin', '>=', now())
                        ->orWhereNull('date_fin');
                })
                ->exists();
        }
        
        $users = User::all();
        $conges = Conge::all();
        
        return Inertia::render('Conges/IndexPublic', [
            'conges' => $conges,
            'users' => $users,
            'employe' => $employe,
            'hasActiveContract' => $hasActiveContract
        ]);
    }
}