<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractRequest;
use App\Models\Alerts;
use App\Models\Contract;
use App\Models\Departement;
use App\Models\Employe;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ContratsController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user();
        $departements = Departement::all();

        if ($currentUser->role === 'superadmin') {
            $contracts = Contract::with(['employe.user', 'employe.departement'])
                ->latest()
                ->get();
        } elseif ($currentUser->role === 'admin') {
            $contracts = Contract::with(['employe.user', 'employe.departement'])
                ->whereHas('employe.user', function ($query) {
                    $query->whereIn('role', ['manager', 'user']);
                })
                ->latest()
                ->get();
        } elseif ($currentUser->role === 'manager') {
            $contracts = Contract::with(['employe.user', 'employe.departement'])
                ->whereHas('employe.user', function ($query) {
                    $query->where('role', 'user');
                })
                ->latest()
                ->get();
        } else {
            $contracts = collect();
        }

        $users = User::with(['employe', 'employe.contrats'])->get();

        return Inertia::render('Contrats/IndexContrats', [
            'contracts' => $contracts,
            'departments' => $departements,
        ]);
    }

    public function create(StoreContractRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('contracts');
            $validated['document_path'] = $documentPath;
        } else {
            $documentPath = null;
        }

        $employe = Employe::find($validated['employe_id']);  
        if (!$employe) {
            return redirect()->back()->withErrors(['employe_id' => 'Employé introuvable']);
        }

        $contract = Contract::create([
            'reference' => $validated['reference'],
            'type_contrat' => $validated['type_contrat'],
            'titre' => $validated['titre'],
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'] ?? null,
            'salaire_mensuel' => $validated['salaire_mensuel'] ?? 0,
            'taux_horaire' => $validated['taux_horaire'] ?? 0,
            'taux_heures_supp' => $validated['taux_heures_supp'] ?? 0,
            'montant_fixe' => $validated['montant_fixe'] ?? 0,
            'mode_paiement' => $validated['mode_paiement'],
            'employe_id' => $employe->id,
            'document_path' => $documentPath,
            'created_by' => auth()->id(),
        ]);

        // Création d'une alerte
        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'contrat',
            'message' => "a attribué un nouveau contrat de type {$contract->type_contrat} à l'employé {$employe->matricule}",
        ]);

        return redirect()->route('contrats')->with(['success' => 'Nouveau contrat créé avec succès']);
    }

    public function delete($id)
    {
        $contract = Contract::with('employe.user')->findOrFail($id);

        $employe = $contract->employe;

        $contract->delete();

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'contrat',
            'message' => "a supprimé un contrat de type {$contract->type_contrat} de l'employé avec le matricule {$employe->matricule}",
        ]);

        return redirect()->route('contrats')->with(['success'=> 'Contrat supprimé avec succès']);
    }
}