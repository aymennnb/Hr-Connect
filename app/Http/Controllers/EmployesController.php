<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeInsertRequest;
use App\Http\Requests\EmployeUpdateRequest;
use App\Models\Contract;
use App\Models\Employe;
use App\Models\User;
use App\Models\Departement;
use App\Models\Alerts;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployesController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user();

        if ($currentUser->role === 'superadmin') {
            $employes = Employe::with(['user', 'departement'])->get();
        } elseif ($currentUser->role === 'admin') {
            $employes = Employe::with(['user', 'departement'])
                ->whereHas('user', function ($query) {
                    $query->whereIn('role', ['manager', 'user']);
                })
                ->get();
        } elseif ($currentUser->role === 'manager') {
            $employes = Employe::with(['user', 'departement'])
                ->whereHas('user', function ($query) {
                    $query->where('role', 'user');
                })
                ->get();
        } else {
            // Si autre rôle (par exemple un simple employé), on ne retourne rien
            $employes = collect(); // collection vide
        }

        $departements = Departement::all();
        $users = User::all();

        return Inertia::render('Employes/IndexEmployes', [
            'employes' => $employes,
            'departements' => $departements,
            'users' => $users,
        ]);
    }


    public function create(EmployeInsertRequest $request)
    {
        // dd($request->all());
        $validated = $request->validated();
        
        // Création de l'utilisateur
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // Gestion de la photo
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('employesPhotos', 'public');
        }

        // Création de l'employé
        $employe = Employe::create([
            'user_id' => $validated['user_id'],
            'departement_id' => $validated['departement_id'],
            'matricule' => $validated['matricule'],
            'poste' => $validated['poste'],
            'date_embauche' => $validated['date_embauche'],
            'telephone' => $validated['telephone'],
            'adresse' => $validated['adresse'],
            'date_naissance' => $validated['date_naissance'],
            'ville' => $validated['ville'],
            'etat_civil' => $validated['etat_civil'],
            'genre' => $validated['genre'],
            'cnss' => $validated['cnss'],
            'cin' => $validated['cin'],
            'photo' => $photoPath,
            'email' => $validated['email'],
        ]);

        // Gestion du document du contrat
        $documentPath = null;
        if ($request->hasFile('contract_document_path')) {
            $documentPath = $request->file('contract_document_path')->store('contracts', 'public');
        }

        // Création du contrat
        $contract = Contract::create([
            'reference' => $validated['contract_reference'],
            'type_contrat' => $validated['contract_type'],
            'titre' => $validated['contract_titre'],
            'poste' => $validated['poste'],
            'date_debut' => $validated['contract_date_debut'],
            'date_fin' => $validated['contract_date_fin'] ?? null,
            'salaire_mensuel' => $validated['contract_salaire_mensuel'] ?? 0,
            'taux_horaire' => $validated['contract_taux_horaire'] ?? 0,
            'taux_heures_supp' => $validated['contract_taux_heures_supp'] ?? 0,
            'montant_fixe' => $validated['contract_montant_fixe'] ?? 0,
            'mode_paiement' => $validated['contract_mode_paiement'],
            'employe_id' => $employe->id,
            'document_path' => $documentPath,
            'created_by' => auth()->id(),
        ]);

        // Création des alertes
        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'employe',
            'message' => "a ajouté un employé avec le matricule {$employe->matricule}",
        ]);

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'contrat',
            'message' => "a créé un contrat {$contract->type_contrat} pour l'employé {$employe->matricule}",
        ]);

        return redirect()->route('employes')->with(['success' => 'Employé et contrat ajoutés avec succès']);
    }

    public function edit($id)
    {
        $employe = Employe::findOrFail($id);
        return Inertia::render('Employes/EditEmploye', compact('employe'));
    }

    public function update(EmployeUpdateRequest $request,$id)
    {
        dd($request->all());
    //     $employe = Employe::findOrFail($id);
    //     $validated = $request->validated();

    //     if ($employe->user) {
    //         $employe->user->update([
    //             'name' => $validated['name'],
    //             'email' => $validated['email'],
    //             'role' => $validated['role'],
    //         ]);
    //     }

    //     if ($request->hasFile('photo')) {
    //         if ($employe->photo && Storage::disk('public')->exists($employe->photo)) {
    //             Storage::disk('public')->delete($employe->photo);
    //         }
            
    //         $photoPath = $request->file('photo')->store('employesPhotos', 'public');
    //         $validated['photo'] = $photoPath;
    //     } else {
    //         unset($validated['photo']);
    //     }

    //     $employe->update($validated);

    //     Alerts::create([
    //         'user_id' => auth()->id(),
    //         'role' => auth()->user()->role,
    //         'action' => 'update',
    //         'type' => 'employe',
    //         'message' => "a mis à jour les informations de l'employé avec le matricule {$employe->matricule}",
    //     ]);

    //     return redirect()->route('employes')->with(['success'=>'Employé mis à jour avec succès']);
    }

    public function delete($id)
    {
        $employe = Employe::findOrFail($id);
        $user = $employe->user;

        $today = Carbon::today();

        $hasContract = Contract::where('employe_id', $employe->id)
        ->where('date_debut', '<=', $today)
        ->where(function($query) use ($today) {
            $query->whereNull('date_fin')       
                ->orWhere('date_fin', '>=', $today); 
        })
        ->exists();

        if ($hasContract) {
            Alerts::create([
                'user_id' => auth()->id(),
                'role' => auth()->user()->role,
                'action' => 'try-delete',
                'type' => 'employe',
                'message' => "a tenté de supprimer l'employé avec le matricule {$employe->matricule} malgré qu'un contrat actif lui associé",
            ]);
            return redirect()->route('employes')->with([
                'error' => "Impossible de supprimer l'employé avec le matricule {$employe->matricule} car il est actuellement associé à un contrat"
            ]);
        }

        if ($employe->photo && Storage::disk('public')->exists($employe->photo)) {
            Storage::disk('public')->delete($employe->photo);
        }

        $matricule = $employe->matricule;
        
        $employe->delete();

        if ($user) {
            $user->delete();
        }

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'employe',
            'message' => "a supprimé l'employé avec le matricule {$matricule}",
        ]);

        return redirect()->route('employes')->with(['success'=> 'Employé supprimé avec succès']);
    }
    
    public function bulkDelete(Request $request)
    {
        $ids = $request->employes_ids;

        if (empty($ids)) {
            return redirect()->route('employes')->with(['error' => 'Aucun employé sélectionné']);
        }

        $today = Carbon::today();
        $employeesWithContracts = [];
        $deletedCount = 0;

        foreach ($ids as $id) {
            $employe = Employe::find($id);

            if (!$employe) {
                continue;
            }

            $hasContract = Contract::where('employe_id', $employe->id)
                ->where('date_debut', '<=', $today)
                ->where(function($query) use ($today) {
                    $query->whereNull('date_fin')       
                        ->orWhere('date_fin', '>=', $today); 
                })
                ->exists();

            if ($hasContract) {
                $employeesWithContracts[] = $employe->matricule;
                Alerts::create([
                    'user_id' => auth()->id(),
                    'role' => auth()->user()->role,
                    'action' => 'try-delete',
                    'type' => 'employe',
                    'message' => "a tenté de supprimer l'employé avec le matricule {$employe->matricule} malgré qu'un contrat actif lui associé",
                ]);
                continue;
            }

            $user = $employe->user;

            if ($employe->photo && Storage::disk('public')->exists($employe->photo)) {
                Storage::disk('public')->delete($employe->photo);
            }

            $matricule = $employe->matricule;
            $employe->delete();

            if ($user) {
                $user->delete();
            }

            Alerts::create([
                'user_id' => auth()->id(),
                'role' => auth()->user()->role,
                'action' => 'delete',
                'type' => 'employe',
                'message' => "a supprimé l'employé avec le matricule {$matricule}",
            ]);

            $deletedCount++;
        }

        if (!empty($employeesWithContracts)) {
            $errorMessage = $deletedCount > 0 
                ? 'Certains employés ont été supprimés, mais les employés avec les matricules suivants n\'ont pas pu être supprimés car ils ont des contrats actifs : ' . implode(', ', $employeesWithContracts)
                : 'Impossible de supprimer les employés avec les matricules suivants car ils ont des contrats actifs : ' . implode(', ', $employeesWithContracts);

            Alerts::create([
                'user_id' => auth()->id(),
                'role' => auth()->user()->role,
                'action' => 'try-delete',
                'type' => 'employe',
                'message' => "a tenté de supprimer des employés avec contrats actifs (matricules: " . implode(', ', $employeesWithContracts) . ")",
            ]);

            return redirect()->route('employes')->with([
                $deletedCount > 0 ? 'success' : 'error' => $errorMessage,
                'deleted_count' => $deletedCount,
                'blocked_count' => count($employeesWithContracts)
            ]);
        }

        return redirect()->route('employes')->with(['success' => 'Les employés sélectionnés ont été supprimés avec succès']);
    }
}
