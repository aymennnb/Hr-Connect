<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartementRequest;
use App\Models\Departement;
use App\Models\Alerts;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DepartementController extends Controller
{
    public function index()
    {
        $departements = Departement::all();
        $users = User::select('id', 'name')->get();

        return Inertia::render('Departements/IndexDepartements', [
            'departements' => $departements,
            'users'=>$users,
        ]);
    }

    public function create(DepartementRequest $request)
    {
        $validated = $request->validated();

        $departement = Departement::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'uploaded_by' => $validated['uploaded_by'],
            'created_by' => Auth::id()
        ]);

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'add',
            'type' => 'departement',
            'message' => "a ajouté un nouveau département : {$departement->name} (ID: {$departement->id})"
        ]);

        return redirect()->route('departements.index')
            ->with(['success' => "Le département {$departement->name} a été créé."]);
    }

    public function edit($id)
    {
        $departement = Departement::findOrFail($id);

        return Inertia::render('Departements/EditDepartement', [
            'departement' => $departement
        ]);
    }

    public function update(DepartementRequest $request, $id)
    {
        $validated = $request->validated();

        $departement = Departement::findOrFail($id);
        $departement->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null
        ]);

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'update',
            'type' => 'departement',
            'message' => "a mis à jour le département : {$departement->name} (ID: {$departement->id})"
        ]);

        return redirect()->route('departements.index')
            ->with(['success' => "Le département {$departement->name} a été mis à jour."]);
    }

    public function delete($id)
    {
        $departement = Departement::findOrFail($id);
        $name = $departement->name;

        $departement->delete();

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'delete',
            'type' => 'departement',
            'message' => "a supprimé le département : {$name} (ID: {$id})"
        ]);

        return redirect()->route('departements.index')
            ->with(['success' => "Le département {$name} a été supprimé."]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('departement_ids', []);

        if (empty($ids)) {
            return back()->with(['error' => 'Aucun département sélectionné.']);
        }

        foreach ($ids as $id) {
            $departement = Departement::find($id);
            if ($departement) {
                $name = $departement->name;
                $departement->delete();

                Alerts::create([
                    'user_id' => Auth::id(),
                    'role' => Auth::user()->role,
                    'action' => 'delete',
                    'type' => 'departement',
                    'message' => "a supprimé le département : {$name} (ID: {$id})"
                ]);
            }
        }

        return back()->with(['success' => 'Les départements sélectionnés ont été supprimés.']);
    }
}
