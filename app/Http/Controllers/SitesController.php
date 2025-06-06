<?php

namespace App\Http\Controllers;

use App\Http\Requests\SitesRequest;
use App\Http\Requests\SiteUpdateRequest;
use App\Models\Alerts;
use App\Models\Conge;
use App\Models\Departement;
use App\Models\Documents;
use App\Models\DocumentsAccess;
use App\Models\Employe;
use App\Models\Location;
use App\Models\Sites;
use App\Models\Surface;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SitesImport;
use Illuminate\Support\Facades\Auth;


class SitesController extends Controller
{
    public function index(Request $request)
    {
        $sites = Sites::all();
        $addresses = Sites::select('address')->distinct()->get();
        $documents = Documents::all();
        $users = User::select('id','name')->get();
        $surfaces = Surface::all();
        $locations = Location::all();

        return inertia('Sites/IndexSites', [
            'sites' => $sites,
            'addresses' => $addresses,
            'documents' => $documents,
            'users'=>$users,
            'surfaces'=>$surfaces,
            'locations'=>$locations
        ]);
    }

    public function create(SitesRequest $request)
    {
        $validated = $request->validated();

        $site = new Sites();

        $site->name = $request->name;
        $site->web = $request->web;
        $site->email = $request->email;
        $site->phone = $request->phone;
        $site->address = $request->address;
        $site->latitude = $request->latitude;
        $site->longitude = $request->longitude;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('sitesImages', 'public');
            $site->image = $imagePath;
        }

        $site->ville = $request->ville;
        $site->titre_foncier = $request->titre_foncier;
        $site->superficie_terrain = $request->superficie_terrain;
        $site->zoning_urbanistique = $request->zoning_urbanistique;
        $site->consistance = $request->consistance;
        $site->surface_gla = $request->surface_gla;
        $site->uploaded_by = auth()->user()->id;
        $site->type_site = $request->type_site;

        $site->save();

        if ($request->type_site === 'location') {
            Location::create([
                'sitef_id' => $site->id,
                'exploitant' => $request->exploitant,
                'bailleur' => $request->bailleur,
                'date_effet' => $request->date_effet,
                'duree_bail' => $request->duree_bail,
                'loyer_actuel' => $request->loyer_actuel,
                'taux_revision' => $request->taux_revision,
                'prochaine_revision' => $request->prochaine_revision,
            ]);
        }

        Surface::create([
            'site_id' => $site->id,
            'total' => $request->total,
            'vn' => $request->vn['total'],
            'show_room_dacia' => $request->vn['show_room_dacia'],
            'show_room_renault' => $request->vn['show_room_renault'],
            'show_room_nouvelle_marque' => $request->vn['show_room_nouvelle_marque'],
            'zone_de_preparation' => $request->vn['zone_de_preparation'],
            'apv' => $request->apv['total'],
            'rms' => $request->apv['rms'],
            'atelier_mecanique' => $request->apv['atelier_mecanique'],
            'atelier_carrosserie' => $request->apv['atelier_carrosserie'],
            'vo' => $request->vo,
            'parking' => $request->parking,
        ]);

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'site',
            'message' => "a ajouté un nouveau site avec le nom {$site->name} et l'id {$site->id}.",
        ]);

        return redirect('sites')->with(['success' => "Le site {$site->name} a été créé."]);
    }

    public function edit($id)
    {
        $site = Sites::findOrFail($id);

        return inertia('Sites/EditSite',compact('site'));
    }

    public function update(SiteUpdateRequest $request) {
        $item = Sites::where('id', $request->id)->first();
        $oldType = $item->type_site;

        $item->name = $request->name;
        $item->web = $request->web;
        $item->email = $request->email;
        $item->phone = $request->phone;
        $item->address = $request->address;
        $item->latitude = $request->latitude;
        $item->longitude = $request->longitude;
        $item->ville = $request->ville;
        $item->titre_foncier = $request->titre_foncier;
        $item->superficie_terrain = $request->superficie_terrain;
        $item->zoning_urbanistique = $request->zoning_urbanistique;
        $item->consistance = $request->consistance;
        $item->surface_gla = $request->surface_gla;
        $item->type_site = $request->type_site;

        if ($request->hasFile('image')) {
            if ($item->image && Storage::disk('public')->exists($item->image)) {
                Storage::disk('public')->delete($item->image);
            }

            $imagePath = $request->file('image')->store('sitesImages', 'public');
            $item->image = $imagePath;
        }

        $item->save();

        if ($oldType === 'location' && $item->type_site === 'propre') {
            Location::where('sitef_id', $item->id)->delete();
        }

        if ($item->type_site === 'location') {
            Location::updateOrCreate(
                ['sitef_id' => $item->id],
                [
                    'exploitant' => $request->exploitant,
                    'bailleur' => $request->bailleur,
                    'date_effet' => $request->date_effet,
                    'duree_bail' => $request->duree_bail,
                    'loyer_actuel' => $request->loyer_actuel,
                    'taux_revision' => $request->taux_revision,
                    'prochaine_revision' => $request->prochaine_revision,
                ]
            );
        }

        Surface::updateOrCreate(
            ['site_id' => $item->id],
            [
                'total' => $request->input('total'),
                'vn' => $request->input('vn.total'),
                'show_room_dacia' => $request->input('vn.show_room_dacia'),
                'show_room_renault' => $request->input('vn.show_room_renault'),
                'show_room_nouvelle_marque' => $request->input('vn.show_room_nouvelle_marque'),
                'zone_de_preparation' => $request->input('vn.zone_de_preparation'),
                'apv' => $request->input('apv.total'),
                'rms' => $request->input('apv.rms'),
                'atelier_mecanique' => $request->input('apv.atelier_mecanique'),
                'atelier_carrosserie' => $request->input('apv.atelier_carrosserie'),
                'vo' => $request->vo,
                'parking' => $request->parking,
            ]
        );

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'site',
            'message' => "a mis à jour le site avec le nom {$item->name} et l'ID {$item->id}.",
        ]);

        return redirect('sites')->with(['success' => "Le site {$item->name} a été mis à jour."]);
    }

    public function delete($id)
    {
        $item = Sites::where('id',$id)->first();

        if (!$item) {
            return redirect('sites')->with(['error' => 'Site not found.']);
        }

        if ($item->image && Storage::disk('public')->exists($item->image)) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'site',
            'message' => "a supprimé le site avec le nom {$item->name} et l'ID {$item->id}.",
        ]);

        return redirect('sites')->with(['success' => "Le site {$item->name} a été supprimé."]);
    }
    public function map()
    {
        $user = Auth::user();

        // Données déjà récupérées
        $users = User::all();
        $alerts = Alerts::all();

        if ($user->role === 'admin' || $user->role === 'superadmin') {
            $documents = Documents::all();
        } else {
            $accessibleDocumentIds = DocumentsAccess::where('user_id', $user->id)
                ->pluck('document_id')
                ->toArray();

            $documents = Documents::whereIn('id', $accessibleDocumentIds)->get();
        }

        // --- Nouvelles données à calculer ---

        // Total des employés
        $totalEmployees = Employe::count();

        // Nombre de départements
        $departmentsCount = Departement::count();

        // Nombre total des demandes de congé
        $leaveRequestsCount = Conge::count();

        // Employés par département
        $employeesByDepartment = Departement::withCount('employes')->get()->map(function ($dept) {
            return [
                'departement_id' => $dept->id,
                'departement_name' => $dept->name,
                'employees_count' => $dept->employes_count,
            ];
        });

        // Demandes de congé par statut (version simplifiée)
        $leaveRequestsByStatus = Conge::select('status', \DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        return Inertia::render('Dashboard', [
            'users' => $users,
            'alerts' => $alerts,
            'documents' => $documents,
            'totalEmployees' => $totalEmployees,
            'departmentsCount' => $departmentsCount,
            'leaveRequestsCount' => $leaveRequestsCount,
            'employeesByDepartment' => $employeesByDepartment,
            'leaveRequestsByStatus' => $leaveRequestsByStatus,
        ]);
    }

    public function SitesDelete(Request $request)
    {
        $ids = $request->input('sites_ids', []);

        if (empty($ids)) {
            return back()->with(['error'=> 'Aucun site sélectionné.']);
        }

        foreach ($ids as $id) {
            $site = Sites::find($id);

            if (!$site) {
                continue;
            }

            if ($site->image && Storage::disk('public')->exists($site->image)) {
                Storage::disk('public')->delete($site->image);
            }

            $siteName = $site->name;
            $siteId = $site->id;
            $site->delete();

            Alerts::create([
                'user_id' => auth()->id(),
                'role' => auth()->user()->role,
                'action' => 'delete',
                'type' => 'site',
                'message' => "a supprimé le site avec le nom {$siteName} et l'id {$siteId}.",
            ]);
        }

        return back()->with(['success'=> 'Les sites sélectionnés ont été supprimés.']);
    }

    /**
     * Importe des sites à partir d'un fichier CSV ou XLSX
     */
    public function importSites(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        $file = $request->file('file');

        $import = new SitesImport;
        Excel::import($import, $file);
        $champsObligatoires = [
            'name', 'web', 'email', 'phone', 'address',
            'latitude', 'longitude', 'ville'
        ];
        $champsListe = implode(', ', $champsObligatoires);

        if (count($import->errors) > 0) {
            $total = count($import->errors);
            return back()->with(['error' => "$total ligne(s) n'ont pas pu être importées.\n\nVeuillez vérifier que les champs obligatoires suivants d'un Site sont remplis :\n$champsListe"]);
        }

        return back()->with(['success'=> $import->count === 1 ? "1 site a été importé avec succès." : "{$import->count} sites ont été importés avec succès."]);
    }

}
