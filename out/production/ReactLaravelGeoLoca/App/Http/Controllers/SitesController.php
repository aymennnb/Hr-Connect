<?php

namespace App\Http\Controllers;

use App\Http\Requests\SitesRequest;
use App\Http\Requests\SiteUpdateRequest;
use App\Models\Alerts;
use App\Models\Documents;
use App\Models\DocumentsAccess;
use App\Models\Sites;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SitesController extends Controller
{
    public function index(Request $request)
    {
        $sites = Sites::select('id', 'image', 'name', 'email', 'phone', 'web', 'address', 'latitude', 'longitude', 'created_at', 'updated_at')->get();
        $addresses = Sites::select('address')->distinct()->get();
        $documents = Documents::all();

        return inertia('Sites/IndexSites', [
            'sites' => $sites,
            'addresses' => $addresses,
            'documents' => $documents
        ]);
    }

    public function create(SitesRequest $request)
    {
        $validated = $request->validated();
        $sites = new Sites($validated);
        $sites->name = $request->name;
        $sites->web = $request->web;
        $sites->email = $request->email;
        $sites->phone = $request->phone;
        $sites->address = $request->address;
        $sites->latitude = $request->latitude;
        $sites->longitude = $request->longitude;
        $imagePath = $request->file('image')->store('sitesImages', 'public');
        $sites->image = $imagePath;
        $sites->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'site',
            'message' => "a ajouté un site avec le nom {$sites->name} et l'ID {$sites->id}.",
        ]);

        return redirect('sites')->with(['success' => "Le site {$sites->name} a été créé."]);
    }

    public function edit($id)
    {
        $site = Sites::findOrFail($id);

        return inertia('Sites/EditSite',compact('site'));
    }

    public function update(SiteUpdateRequest $request)
    {
        $item = Sites::where('id',$request->id)->first();
        $item->name = $request->name;
        $item->web = $request->web;
        $item->email = $request->email;
        $item->phone = $request->phone;
        $item->address = $request->address;
        $item->latitude = $request->latitude;
        $item->longitude = $request->longitude;

        if ($request->hasFile('image')) {
            if ($item->file && Storage::disk('public')->exists($item->file)) {
                Storage::disk('public')->delete($item->file);
            }

            $imagePath = $request->file('image')->store('sitesImages', 'public');
            $item->file = $imagePath;
        }

        $item->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'site',
            'message' => "a mis à jour le site avec le nom {$item->name} et l'ID {$item->id}.",
        ]);

        return redirect('sites')->with(['success' => "Le site {$item->name} a été mis à jour."]);
    }

    public function show($id)
    {
//        $site = Sites::where('id', $id)->first();
        $documents = Documents::all();

//        if (!$site) {
//            return redirect('sites')->with(['error' => 'Site non trouvé.']);
//        }

//        Alerts::create([
//            'user_id' => auth()->user()->id,
//            'role' => auth()->user()->role,
//            'action' => 'view',
//            'type' => 'site',
//            'message' => "a consulté les détails du site avec le nom {$site->name} et l'id {$site->id}.",
//        ]);

        return inertia('Sites/Details', [
//            'site' => $site,
            'documents' => $documents
        ]);
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
        $sitesMaps = Sites::select('id','image','name','email','phone','web','address','latitude','longitude','created_at','updated_at')->get();
        $documents = Documents::all();
        $documentAccess = DocumentsAccess::select('id','document_id','user_id')->get();

        return Inertia::render('Dashboard', [
            'sitesMaps' => $sitesMaps,
            'documents'=>$documents,
            'documentAccess'=>$documentAccess
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
}
