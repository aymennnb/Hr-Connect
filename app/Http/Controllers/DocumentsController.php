<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentUpdateRequest;
use App\Http\Requests\StoreDocumentRequest;
use App\Models\Alerts;
use App\Models\Documents;
use App\Models\DocumentsAccess;
use App\Models\Sites;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DocumentsExport;

class DocumentsController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin' || $user->role === 'superadmin') {
            $documents = Documents::select('id', 'title', 'description', 'file_path', 'expiration_date', 'site_id', 'uploaded_by','document_type', 'created_at', 'updated_at')
                ->get();
            $usersAccess = User::whereIn('role', ['user', 'manager'])->select('id', 'name')->get();
        } else {
            $documents = Documents::select('id', 'title', 'description', 'file_path', 'expiration_date', 'site_id', 'uploaded_by','document_type', 'created_at', 'updated_at')
                ->whereHas('documentAccesses', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })->get();
            $usersAccess = User::whereIn('role', ['user'])->select('id', 'name')->get();
        }
        $sites = Sites::select('id', 'name')->get();
        $users = User::select('id', 'name')->get();
        $documentAccess = DocumentsAccess::with('user')->get();
        $AccessTable = DocumentsAccess::select('document_id', 'user_id')->get();
        return Inertia::render('Documents/IndexDocuments', [
            'documents' => $documents,
            'sites' => $sites,
            'users'=>$users,
            'usersAccess' => $usersAccess,
            'DocumentAccess'=> $documentAccess,
            'AccessTable'=>$AccessTable
        ]);
    }


    public function SitesRender()
    {
        $sites = Sites::select('id', 'name')->get();

        return inertia('Documents/AddDocuments', [
            'sites' => $sites
        ]);
    }

    public function create(StoreDocumentRequest $request)
    {
        $validated = $request->validated();
        $document = new Documents($validated);
        $document->title = $request->title;
        $document->description = $request->description;
        $document->expiration_date = $request->expiration_date;
        $document->site_id = $request->site_id;
        $document->uploaded_by = $request->uploaded_by;
        $document->document_type = $request->document_type;

        $filePath = $request->file('file_path')->store('documents', 'public');
        $document->file_path = $filePath;

        $document->save();

        if (auth()->user()->role === 'manager') {
            DocumentsAccess::create([
                'document_id' => $document->id,
                'user_id' => auth()->user()->id,
            ]);
        }

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'document',
            'message' => " a ajouté un document avec le titre {$document->title} et l'ID {$document->id}.",
        ]);

        return redirect()->route('documents')->with(['success'=>"Le document {$document->title} a été créé avec succès."]);
    }

    public function edit($id)
    {
        $document = Documents::findOrFail($id);
        $sites = Sites::select('id', 'name')->get();
        return inertia('Documents/EditDocuments', [
            'document' => $document,
            'sites' => $sites
        ]);
    }

    public function update(DocumentUpdateRequest $request)
    {
        $item = Documents::findOrFail($request->id);

        if (!$item) {
            return redirect('documents')->with(['error' => 'Document non trouvé.']);
        }

        $item->title = $request->title;
        $item->description = $request->description;
        $item->expiration_date = $request->expiration_date;
        $item->site_id = $request->site_id;
        $item->uploaded_by = $request->uploaded_by;
        $item->document_type = $request->document_type;

        if ($request->hasFile('file_path')) {
            if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
                Storage::disk('public')->delete($item->file_path);
            }

            $filePath = $request->file('file_path')->store('documents', 'public');
            $item->file_path = $filePath;
        }

        $item->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'document',
            'message' => " a modifié un document avec le titre {$item->title} et l'id {$item->id} .",
        ]);

        return redirect('documents')->with(['success'=>"Le document {$item->title} a été mis à jour."]);
    }

    public  function show($id)
    {
        $document = Documents::where('id',$id)->first();
        $sites = Sites::select('id', 'name')->get();
        $users = User::select('id', 'name')->get();

        return inertia('Documents/DetailsDocument',[
            'document'=>$document,
            'sites'=>$sites,
            'users'=>$users
        ]);
    }

    public function delete($id)
    {
        $item = Documents::where('id',$id)->first();
        $documentTitle = $item->title;
        if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
            Storage::disk('public')->delete($item->file_path);
        }

        $item->delete();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'document',
            'message' => " a supprimé un document avec le titre {$documentTitle} et l'id {$item->id}.",
        ]);

        return redirect()->route('documents')->with(['success'=>"Le document {$documentTitle} a été supprimé."]);
    }

    public function recover($id)
    {
        $users = User::select('id', 'name')->get();
        $documentAccesses = DocumentsAccess::where('document_id', $id)
            ->join('users', 'users.id', '=', 'documents_accesses.user_id')
            ->select('users.id', 'users.name')
            ->get();

        return Inertia::render('Documents/DocumentAcces', [
            'documentId' => $id,
            'users' => $users,
            'documentAccesses' => $documentAccesses
        ]);
    }


    public function updateAccess(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:documents,id',
            'users' => 'array',
            'users.*' => 'exists:users,id'
        ]);

        $documentId = $request->document_id;
        $document = Documents::find($documentId);

        $existingAccess = DocumentsAccess::where('document_id', $documentId)->pluck('user_id')->toArray();

        if (empty($request->users)) {
            DocumentsAccess::where('document_id', $documentId)->delete();

            foreach ($existingAccess as $userId) {
                $user = User::find($userId);
                Alerts::create([
                    'user_id' => auth()->user()->id,
                    'role' => auth()->user()->role,
                    'action' => 'updateAccessRetire',
                    'type' => 'document',
                    'message' => "a retiré l'accès au document {$document->title} avec l'id {$documentId} à l'utilisateur {$user->name} qui a l'id {$user->id}."
                ]);
            }

            return redirect()->route('documents')->with(['success'=>"Les accès au document {$document->title} ont été supprimés."]);
        }

        $usersToAdd = array_diff($request->users, $existingAccess);
        $usersToRemove = array_diff($existingAccess, $request->users);

        DocumentsAccess::where('document_id', $documentId)->delete();

        foreach ($request->users as $userId) {
            DocumentsAccess::create([
                'document_id' => $documentId,
                'user_id' => $userId
            ]);
        }

        foreach ($usersToAdd as $userId) {
            $user = User::find($userId);
            Alerts::create([
                'user_id' => auth()->user()->id,
                'role' => auth()->user()->role,
                'action' => 'updateAccessLimit',
                'type' => 'document',
                'message' => "a limité l'accès au document {$document->title} avec l'id {$documentId} à l'utilisateur qui a l'id {$user->id}."
            ]);
        }

        foreach ($usersToRemove as $userId) {
            $user = User::find($userId);
            Alerts::create([
                'user_id' => auth()->user()->id,
                'role' => auth()->user()->role,
                'action' => 'updateAccessRetire',
                'type' => 'document',
                'message' => "a retiré l'accès au document {$document->title} avec l'id {$documentId} à l'utilisateur qui a l'id {$user->id}."
            ]);
        }

        return redirect()->route('documents')->with(['success'=>"Les accès au document {$document->title} ont été mis à jour."]);
    }


    public function DocsDelete(Request $request)
    {
        $documentIds = $request->input('document_ids');

        if (is_array($documentIds) && count($documentIds) > 0) {
            $documents = Documents::whereIn('id', $documentIds)->get();
            foreach ($documents as $document) {
                $documentTitle = $document->title;
                if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                    Storage::disk('public')->delete($document->file_path);
                }
                $document->delete();

                Alerts::create([
                    'user_id' => auth()->user()->id,
                    'role' => auth()->user()->role,
                    'action' => 'delete',
                    'type' => 'document',
                    'message' => "a supprimé un document avec le titre {$documentTitle} et l'id {$document->id}.",
                ]);

            }

            return redirect()->back()->with(['success'=> 'Les documents sélectionnés ont été supprimés.']);
        }

        return redirect()->route('documents')->with(['error'=> 'Aucun document sélectionné pour la suppression.']);
    }


    public function DocsAccess(Request $request)
    {
        $documentIds = $request->input('document_ids');
        $userIds = $request->input('user_ids');

        if (empty($documentIds) || !is_array($userIds)) {
            return response()->json(['error' => 'Données manquantes'], 400);
        }

        foreach ($documentIds as $docId) {
            $document = Documents::find($docId);

            if (!$document) {
                continue;
            }

            $existingAccess = DocumentsAccess::where('document_id', $docId)->pluck('user_id')->toArray();

            $removedUsers = array_diff($existingAccess, $userIds);
            if (!empty($removedUsers)) {
                DocumentsAccess::where('document_id', $docId)->whereIn('user_id', $removedUsers)->delete();
                foreach ($removedUsers as $userId) {
                    $user = User::find($userId);
                    Alerts::create([
                        'user_id' => auth()->user()->id,
                        'role' => auth()->user()->role,
                        'action' => 'updateAccessRetire',
                        'type' => 'document',
                        'message' => "a retiré l'accès au document {$document->title} avec l'id {$docId} à l'utilisateur {$user->name} qui a l'id {$user->id}."
                    ]);
                }
            }

            foreach ($userIds as $userId) {
                $alreadyExists = DocumentsAccess::where('document_id', $docId)
                    ->where('user_id', $userId)->exists();

                if (!$alreadyExists) {
                    DocumentsAccess::create([
                        'document_id' => $docId,
                        'user_id' => $userId
                    ]);

                    $user = User::find($userId);
                    Alerts::create([
                        'user_id' => auth()->user()->id,
                        'role' => auth()->user()->role,
                        'action' => 'updateAccessLimit',
                        'type' => 'document',
                        'message' => "a limité l'accès au document {$document->title} avec l'id {$docId} à l'utilisateur qui a l'id {$user->id}."
                    ]);
                }
            }
        }

        return redirect()->route('documents')->with(['success' => 'Les accès aux documents sélectionnés ont été mis à jour.']);
    }


    public function export(Request $request)
    {
        $searchTerm = $request->query('searchTerm', '');
        $siteIds = $request->query('siteIds') ? explode(',', $request->query('siteIds')) : [];
        $startDate = $request->query('startDate', '');
        $endDate = $request->query('endDate', '');
        $expStartDate = $request->query('expStartDate', '');
        $expEndDate = $request->query('expEndDate', '');

        // Reproduire le même filtrage que dans DocumentsExport pour compter
        $query = Documents::query();

        if (!empty($searchTerm)) {
            $query->where('title', 'like', '%' . $searchTerm . '%');
        }

        if (!empty($siteIds)) {
            $query->whereIn('site_id', $siteIds);
        }

        if (!empty($startDate)) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if (!empty($endDate)) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        if (!empty($expStartDate)) {
            $query->whereDate('expiration_date', '>=', $expStartDate);
        }

        if (!empty($expEndDate)) {
            $query->whereDate('expiration_date', '<=', $expEndDate);
        }

        $count = $query->count();

        $word = $count === 1 ? 'document' : 'documents';

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'export',
            'type' => 'document',
            'message' => "a exporté {$count} {$word} au format Excel.",
        ]);

        $filename = 'documents_' . now()->format('d-m-Y_H-i') . '.xlsx';

        return Excel::download(
            new DocumentsExport($searchTerm, $siteIds, $startDate, $endDate, $expStartDate, $expEndDate),
            $filename
        );
    }

    public function exportCSV(Request $request)
    {
        $searchTerm = $request->query('searchTerm', '');
        $siteIds = $request->query('siteIds') ? explode(',', $request->query('siteIds')) : [];
        $startDate = $request->query('startDate', '');
        $endDate = $request->query('endDate', '');
        $expStartDate = $request->query('expStartDate', '');
        $expEndDate = $request->query('expEndDate', '');

        // Reproduire le même filtrage que dans DocumentsExport pour compter
        $query = Documents::query();

        if (!empty($searchTerm)) {
            $query->where('title', 'like', '%' . $searchTerm . '%');
        }

        if (!empty($siteIds)) {
            $query->whereIn('site_id', $siteIds);
        }

        if (!empty($startDate)) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if (!empty($endDate)) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        if (!empty($expStartDate)) {
            $query->whereDate('expiration_date', '>=', $expStartDate);
        }

        if (!empty($expEndDate)) {
            $query->whereDate('expiration_date', '<=', $expEndDate);
        }

        $count = $query->count();

        $word = $count === 1 ? 'document' : 'documents';

        Alerts::create([
            'user_id' => Auth::id(),
            'role' => Auth::user()->role,
            'action' => 'export',
            'type' => 'document',
            'message' => "a exporté {$count} {$word} au format Excel.",
        ]);

        $filename = 'documents_' . now()->format('d-m-Y_H-i') . '.csv';

        return Excel::download(
            new DocumentsExport($searchTerm, $siteIds, $startDate, $endDate, $expStartDate, $expEndDate),
            $filename
        );
    }
}
