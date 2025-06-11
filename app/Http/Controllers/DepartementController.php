<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepartementRequest;
use App\Http\Requests\DepartementUpdateRequest;
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
            'uploaded_by' => Auth::id(),
        ]);

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'add',
            'type' => 'departements',
            'message' => "a ajouté un nouveau département {$departement->name}"
        ]);

        return redirect()->route('departements')->with(['success' => "Le département {$departement->name} a été créé avec succès"]);
    }

    public function edit($id)
    {
        $departement = Departement::findOrFail($id);

        return Inertia::render('Departements/EditDepartement', [
            'departement' => $departement
        ]);
    }

    public function update(DepartementUpdateRequest $request)
    {
        $validated = $request->validated();

        $departement = Departement::findOrFail($request->id);

        $departement->update([
            'name' => $validated['name'],
            'description' => $validated['description']
        ]);

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'update',
            'type' => 'departements',
            'message' => "a mis à jour le département {$departement->name} avec l'ID {$departement->id}"
        ]);

        return redirect()->route('departements')->with(['success' => "Le département {$departement->name} a été mis à jour avec succès"]);
    }


    public function delete($id)
    {
        $departement = Departement::withCount('employes')->findOrFail($id);
        $name = $departement->name;

        if ($departement->employes_count > 0) {
            Alerts::create([
                'user_id' => Auth::id(),
                'role' => Auth::user()->role,
                'action' => 'try-delete',
                'type' => 'departements',
                'message' => "a tenté de supprimer le département {$name} avec l'ID {$departement->id} qui contient encore des employés"
            ]);

            return redirect()->route('departements')->with([
                'error' => "Impossible de supprimer le département {$name} car il contient encore des employés"
            ]);
        }

        $departement->delete();

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'delete',
            'type' => 'departements',
            'message' => "a supprimé le département {$name} avec l'ID {$departement->id}"
        ]);

        return redirect()->route('departements')->with([
            'success' => "Le département {$name} a été supprimé avec succès"
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->departements_ids;
        
        if (empty($ids)) {
            return back()->with(['error' => 'Aucun département sélectionné']);
        }

        $departementsWithEmployees = [];
        $deletedCount = 0;

        foreach ($ids as $id) {
            $departement = Departement::withCount('employes')->find($id);
            
            if (!$departement) {
                continue;
            }

            if ($departement->employes_count > 0) {
                $departementsWithEmployees[] = $departement->name;
                
                Alerts::create([
                    'user_id' => Auth::id(),
                    'role' => Auth::user()->role,
                    'action' => 'try-delete',
                    'type' => 'departements',
                    'message' => "a tenté de supprimer le département {$departement->name} avec l'ID {$id} qui contient encore des employés"
                ]);
                
                continue;
            }

            $name = $departement->name;
            $departement->delete();

            Alerts::create([
                'user_id' => Auth::id(),
                'role' => Auth::user()->role,
                'action' => 'delete',
                'type' => 'departements',
                'message' => "a supprimé le département {$name} avec l'ID {$id}"
            ]);

            $deletedCount++;
        }

        if (!empty($departementsWithEmployees)) {
            $message = $deletedCount > 0 
                ? "{$deletedCount} département(s) supprimé(s), mais certains n'ont pas pu être supprimés car ils contiennent des employés"
                : "Aucun département n'a pu être supprimé car ils contiennent tous des employés";

            return back()
                ->with($deletedCount > 0 ? 'success' : 'error', $message)
                ->with('departements_with_employees', $departementsWithEmployees);
        }

        return back()->with(['success' => 'Les départements sélectionnés ont été supprimés avec succès']);
    }
}
