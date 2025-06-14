<?php

namespace App\Http\Controllers;

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
        $query = Salaire::with('employe.user');

        // Recherche par nom d'employé
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('employe.user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Filtre par mois
        if ($request->filled('month')) {
            $month = str_pad($request->month, 2, '0', STR_PAD_LEFT);
            $query->whereRaw("SUBSTRING_INDEX(mois, '-', -1) = ?", [$month]);
        }

        // Filtre par année
        if ($request->filled('year')) {
            $query->where('mois', 'like', "{$request->year}-%");
        }

        $salaires = $query->orderBy('mois', 'desc')->get();
        $employes = Employe::with('user')->get();

        return Inertia::render('Salaires/IndexSalaires', [
            'salaires' => $salaires,
            'employes' => $employes,
            'filters' => $request->only(['search', 'month', 'year'])
        ]);
    }
    
    public function indexPublic()
    {
        $user = Auth::user();
        $employe = $user->employe;
        
        if (!$employe) {
            return redirect()->route('dashboard')->with('error', 'Aucun employé associé à votre compte.');
        }

        $salaires = Salaire::where('employe_id', $employe->id)
            ->latest()
            ->get();

        return Inertia::render('Salaires/indexPublic', [
            'salaires' => $salaires
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'mois' => 'required|date',
            'salaire_base' => 'required|numeric|min:0',
            'prime' => 'required|numeric|min:0',
            'heures_sup' => 'required|numeric|min:0',
            'retenue' => 'required|numeric|min:0',
        ]);

        // Calcul du salaire net
        $salaire_net = $validated['salaire_base'] + $validated['prime'] - $validated['retenue'];

        $salaire = Salaire::create([
            'employe_id' => $validated['employe_id'],
            'mois' => $validated['mois'],
            'salaire_base' => $validated['salaire_base'],
            'prime' => $validated['prime'],
            'heures_sup' => $validated['heures_sup'],
            'retenue' => $validated['retenue'],
            'salaire_net' => $salaire_net,
            'date_traitement' => now(),
        ]);

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'salaire',
            'message' => "a ajouté un salaire pour l'employé {$salaire->employe->user->name} pour le mois de " . date('F Y', strtotime($salaire->mois)),
        ]);

        return redirect()->route('salaires')->with('success', 'Salaire ajouté avec succès.');
    }

    public function update(Request $request, $id)
    {
        $salaire = Salaire::findOrFail($id);

        $validated = $request->validate([
            'employe_id' => 'required|exists:employes,id',
            'mois' => 'required|date',
            'salaire_base' => 'required|numeric|min:0',
            'prime' => 'required|numeric|min:0',
            'heures_sup' => 'required|numeric|min:0',
            'retenue' => 'required|numeric|min:0',
        ]);

        // Calcul du salaire net
        $salaire_net = $validated['salaire_base'] + $validated['prime'] - $validated['retenue'];

        $salaire->update([
            'employe_id' => $validated['employe_id'],
            'mois' => $validated['mois'],
            'salaire_base' => $validated['salaire_base'],
            'prime' => $validated['prime'],
            'heures_sup' => $validated['heures_sup'],
            'retenue' => $validated['retenue'],
            'salaire_net' => $salaire_net,
        ]);

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'salaire',
            'message' => "a mis à jour le salaire de l'employé {$salaire->employe->user->name} pour le mois de " . date('F Y', strtotime($salaire->mois)),
        ]);

        return redirect()->route('salaires')->with('success', 'Salaire mis à jour avec succès.');
    }

    public function delete($id)
    {
        $salaire = Salaire::findOrFail($id);
        
        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'salaire',
            'message' => "a supprimé le salaire de l'employé {$salaire->employe->user->name} pour le mois de " . date('F Y', strtotime($salaire->mois)),
        ]);

        $salaire->delete();

        return redirect()->route('salaires')->with('success', 'Salaire supprimé avec succès.');
    }
}
