<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeInsertRequest;
use App\Http\Requests\EmployeUpdateRequest;
use App\Models\Employe;
use App\Models\User;
use App\Models\Departement;
use App\Models\Alerts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployesController extends Controller
{
    public function index()
    {
        $employes = Employe::with(['user', 'departement'])->get();
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
        $validated = $request->validated();
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('employesPhotos', 'public');
        }

        $employe = Employe::create([
            'user_id' => $user->id,
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

        
        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'employe',
            'message' => "a ajouté un employé avec le matricule {$employe->matricule}",
        ]);

        return redirect()->route('employes')->with(['success'=> 'Employé ajouté avec succès.']);
    }

    public function edit($id)
    {
        $employe = Employe::findOrFail($id);
        return Inertia::render('Employes/EditEmploye', compact('employe'));
    }

    public function update(EmployeUpdateRequest $request)
    {
        dd($request->all());
        // $employe = Employe::findOrFail($id);

        // $validated = $request->validate([
        //     'departement_id' => 'nullable|exists:departements,id',
        //     'poste' => 'nullable|string',
        //     'date_embauche' => 'nullable|date',
        //     'telephone' => 'nullable|string',
        //     'adresse' => 'nullable|string',
        //     'date_naissance' => 'nullable|date',
        //     'ville' => 'nullable|string',
        //     'etat_civil' => 'nullable|string',
        //     'genre' => 'nullable|string',
        //     'cnss' => 'nullable|string',
        //     'cin' => 'nullable|string',
        //     'photo' => 'nullable|image|max:2048',
        // ]);

        // if ($request->hasFile('photo')) {
        //     if ($employe->photo && Storage::disk('public')->exists($employe->photo)) {
        //         Storage::disk('public')->delete($employe->photo);
        //     }

        //     $validated['photo'] = $request->file('photo')->store('employesPhotos', 'public');
        // }

        // $employe->update($validated);

        // Alerts::create([
        //     'user_id' => auth()->id(),
        //     'role' => auth()->user()->role,
        //     'action' => 'update',
        //     'type' => 'employe',
        //     'message' => "a mis à jour l'employé avec le matricule {$employe->matricule}",
        // ]);

        // return redirect()->back()->with('success', 'Employé mis à jour avec succès.');
    }

    public function delete($id)
    {
        $employe = Employe::findOrFail($id);
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

        return redirect()->route('employes')->with(['success'=> 'Employé supprimé avec succès.']);
    }
    
    public function bulkDelete(Request $request)
    {
        $ids = $request->employes_ids;

        if (empty($ids)) {
            return redirect()->route('employes')->with(['error' => 'Aucun employé sélectionné.']);
        }

        foreach ($ids as $id) {
            $employe = Employe::find($id);

            if ($employe) {
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
                    'message' => "a supprimé l'employé avec le matricule {$matricule}.",
                ]);
            }
        }

        return redirect()->route('employes')->with(['success' => 'Les employés sélectionnés ont été supprimés avec succès.']);
    }
}
