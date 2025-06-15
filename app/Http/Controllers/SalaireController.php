<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSalaireRequest;
use App\Models\Salaire;
use App\Models\Employe;
use App\Models\Alerts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SalaireController extends Controller
{
    public function index(Request $request)
    {
        $query = Salaire::query()->with(['employe.user', 'employe.currentContract']);

        $salaires = $query->orderBy('mois', 'desc')->get();

        $currentUser = auth()->user();

        $employes = Employe::with(['user', 'currentContract'])
            ->whereHas('user', function ($query) use ($currentUser) {
                if ($currentUser->role === 'superadmin') {
                    $query->where('id', '!=', $currentUser->id);
                } elseif ($currentUser->role === 'admin') {
                    $query->whereIn('role', ['manager', 'user']);
                } elseif ($currentUser->role === 'manager') {
                    $query->where('role', 'user');
                }
            })
            ->get();

        return Inertia::render('Salaires/IndexSalaires', [
            'salaires' => $salaires,
            'employes' => $employes,
        ]);
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
        
        $salaires = $employe ? $employe->salaires()->orderBy('mois', 'desc')->get() : collect();
        
        return Inertia::render('Salaires/indexPublic', [
            'salaires' => $salaires,
            'employe' => $employe,
            'hasActiveContract' => $hasActiveContract
        ]);
    }

    public function store(StoreSalaireRequest $request)
    {
        $validated = $request->validated();

        $salaire_net = round($validated['salaire_base'] + $validated['prime'] - $validated['retenue'], 2);

        $salaire = Salaire::create([
            'employe_id' => $validated['employe_id'],
            'mois' => $validated['mois'],
            'salaire_base' => round($validated['salaire_base'], 2),
            'prime' => round($validated['prime'], 2),
            'heures_sup' => isset($validated['heures_sup']) ? round($validated['heures_sup'], 2) : 0,
            'retenue' => round($validated['retenue'], 2),
            'salaire_net' => $salaire_net,
            'date_traitement' => now(),
        ]);

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'effectuer',
            'type' => 'salaire',
            'message' => "a effectué un paiement de salaire pour l’employé {$salaire->employe->user->name} pour le mois de " . date('F Y', strtotime($salaire->mois)),
        ]);

        return redirect()->route('salaires')->with(['success' => "Salaire effectué pour l’employé {$salaire->employe->user->name} avec succès"]);
    }

    public function delete($id)
    {
        $salaire = Salaire::findOrFail($id);

        $salaire->delete();

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'salaire',
            'message' => "a annuler l’effectuation du salaire de l'employé {$salaire->employe->user->name} pour le mois de " . date('F Y', strtotime($salaire->mois)),
        ]);

        return redirect()->route('salaires')->with(['success'=> "Salaire annuler pour l’employé {$salaire->employe->user->name}  avec succès"]);
    }
}