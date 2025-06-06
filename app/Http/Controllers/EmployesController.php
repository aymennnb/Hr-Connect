<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\User;
use App\Models\Departement;
use App\Models\Alerts;
use Illuminate\Http\Request;
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'departement_id' => 'nullable|exists:departements,id',
            'matricule' => 'required|unique:employes',
            'poste' => 'nullable|string',
            'date_embauche' => 'nullable|date',
            'telephone' => 'nullable|string',
            'adresse' => 'nullable|string',
            'date_naissance' => 'nullable|date',
            'ville' => 'nullable|string',
            'etat_civil' => 'nullable|string',
            'genre' => 'nullable|string',
            'cnss' => 'nullable|string',
            'cin' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('employesPhotos', 'public');
        }

        $employe = Employe::create($validated);

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'employe',
            'message' => "a ajouté un employé avec le matricule {$employe->matricule}",
        ]);

        return redirect()->back()->with('success', 'Employé ajouté avec succès.');
    }

    public function edit($id)
    {
        $employe = Employe::findOrFail($id);
        return Inertia::render('Employes/EditEmploye', compact('employe'));
    }

    public function update(Request $request, $id)
    {
        $employe = Employe::findOrFail($id);

        $validated = $request->validate([
            'departement_id' => 'nullable|exists:departements,id',
            'poste' => 'nullable|string',
            'date_embauche' => 'nullable|date',
            'telephone' => 'nullable|string',
            'adresse' => 'nullable|string',
            'date_naissance' => 'nullable|date',
            'ville' => 'nullable|string',
            'etat_civil' => 'nullable|string',
            'genre' => 'nullable|string',
            'cnss' => 'nullable|string',
            'cin' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($employe->photo && Storage::disk('public')->exists($employe->photo)) {
                Storage::disk('public')->delete($employe->photo);
            }

            $validated['photo'] = $request->file('photo')->store('employesPhotos', 'public');
        }

        $employe->update($validated);

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'employe',
            'message' => "a mis à jour l'employé avec le matricule {$employe->matricule}",
        ]);

        return redirect()->back()->with('success', 'Employé mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $employe = Employe::findOrFail($id);

        if ($employe->photo && Storage::disk('public')->exists($employe->photo)) {
            Storage::disk('public')->delete($employe->photo);
        }

        $employe->delete();

        Alerts::create([
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'employe',
            'message' => "a supprimé l'employé avec le matricule {$employe->matricule}",
        ]);

        return redirect()->back()->with('success', 'Employé supprimé avec succès.');
    }
}
