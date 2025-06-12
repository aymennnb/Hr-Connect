<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddUseremploye;
use App\Http\Requests\EmployeInsertRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\Alerts;
use App\Models\Contract;
use App\Models\Departement;
use App\Models\Documents;
use App\Models\DocumentsAccess;
use App\Models\Employe;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() 
    {
        $users = User::with('employe')->get(); // Charge les employés associés
        $documents = Documents::select('id', 'title')->get();
        $AccessTable = DocumentsAccess::select('document_id', 'user_id')->get();
        $documentAccess = DocumentsAccess::with('user')->get();
        
        return Inertia::render('Utilisateurs/IndexUsers', [
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    'is_employee' => $user->employe !== null,
                ];
            }),
            'AccessTable' => $AccessTable,
            'documents' => $documents,
            'documentAccess' => $documentAccess,
            'departements' => Departement::all(),
        ]);
    }

    public function create(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,manager,user',
        ]);

        $user = User::updateOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['name'],
                'password' => bcrypt($data['password']),
                'role' => $data['role'],
            ]
        );

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'add',
            'type' => 'user',
            'message' => "a ajouté un nouvel " . $this->translateRole($user->role) . " avec le nom {$user->name} et l'ID {$user->id}",
        ]);

        return redirect()->route('utilisateurs')->with(['success' => "L'utilisateur {$user->name} a été ajouté avec succès"]);
    }

    public function updateRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:admin,manager,user',
        ]);

        $user = User::findOrFail($request->user_id);
        $ancien_role = $user->role;
        $user->role = $request->role;
        $user->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'updaterole',
            'type' => 'user',
            'message' => "a changé le rôle d'un utilisateur avec le nom {$user->name} et l'ID {$user->id} de " . $this->translateRole($ancien_role) . " à " . $this->translateRole($request->role) . "",
        ]);

        return redirect('utilisateurs')->with(['success'=> "Le rôle de l'utilisateur {$user->name} a été mis à jour de " . $this->translateRole($ancien_role) . " à " . $this->translateRole($user->role) . ""]);  
    }

    public function resetPassword($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'password' => bcrypt('12345678'),
        ]);

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'reset',
            'type' => 'user',
            'message' => "a réinitialisé le mot de passe d'un " . $this->translateRole($user->role) . " avec le nom {$user->name} et l'ID {$user->id}",
        ]);

        return redirect('utilisateurs')->with(['success' => "Le mot de passe de {$user->name} (" . $this->translateRole($user->role) . ") a été réinitialisé à la valeur par défaut"]);
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return inertia('Utilisateurs/EditUser', [
            'user' => $user
        ]);
    }

    public function update(UserUpdateRequest $request)
    {
        $item = User::find($request->id);

        if (!$item) {
            return redirect('utilisateurs')->with(['error' => 'Utilisateur non trouvé']);
        }

        $item->name = $request->name;
        $item->email = $request->email;
        $item->role = $request->role;
        if ($request->filled('password')) {
            $item->password = Hash::make($request->password);
        }
        $item->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'user',
            'message' => "a modifié les informations d'un " . $this->translateRole($item->role) . " avec le nom {$item->name} et l'ID {$item->id}",
        ]);

        return redirect('utilisateurs')->with(['success' => "L'utilisateur {$item->name} (" . $this->translateRole($item->role) . ") a été mis à jour"]);
    }

    public function delete($id)
    {
        $item = User::findOrFail($id);

        // Supprimer les accès de l'utilisateur dans la table documents_accesses
        DB::table('documents_accesses')->where('user_id', $id)->delete();

        // Créer une alerte pour la suppression
        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'user',
            'message' => "a supprimé un " . $this->translateRole($item->role) . " avec le nom {$item->name} et l'ID {$item->id}",
        ]);

        // Supprimer l'utilisateur
        $item->delete();

        return redirect('utilisateurs')->with(['success' => "L'utilisateur {$item->name} (" . $this->translateRole($item->role) . ") a été supprimé avec succès"]);
    }

    public function UsersDelete(Request $request)
    {
        $userIds = $request->input('users_ids');

        if (is_array($userIds) && count($userIds) > 0) {
            $users = User::whereIn('id', $userIds)->get();

            foreach ($users as $user) {
                Alerts::create([
                    'user_id' => auth()->user()->id,
                    'role' => auth()->user()->role,
                    'action' => 'delete',
                    'type' => 'user',
                    'message' => "a supprimé un " . $this->translateRole($user->role) . " avec le nom {$user->name} et l'ID {$user->id}",
                ]);

                $user->delete();
            }

            return redirect()->route('utilisateurs')->with(['success' => 'Les utilisateurs sélectionnés ont été supprimés']);
        }

        return redirect()->route('utilisateurs')->with(['error' => 'Aucun utilisateur sélectionné pour la suppression']);
    }

    public function changeGroupRole(Request $request)
    {
        $request->validate([
            'users_ids' => 'required|array',
            'role_group' => 'required|string|in:admin,manager,user',
        ]);

        $users = User::whereIn('id', $request->users_ids)->get();

        foreach ($users as $user) {
            $ancien_role = $user->role;
            $user->update(['role' => $request->role_group]);
            Alerts::create([
                'user_id' => auth()->user()->id,
                'role' => auth()->user()->role,
                'action' => 'update',
                'type' => 'user',
                'message' => "a changé le rôle d'un acteur avec le nom {$user->name} et l'ID {$user->id} de " . $this->translateRole($ancien_role) . " à " . $this->translateRole($request->role_group) . "",
            ]);
        }

        return redirect()->route('utilisateurs')->with(['success' => 'Les rôles des utilisateurs sélectionnés ont été mis à jour de ' . $this->translateRole($ancien_role) . ' à ' . $this->translateRole($request->role_group) . '']);
    }

    public function updateAccessDocs(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'documents' => 'array',
            'documents.*' => 'exists:documents,id',
        ]);

        $userId = $request->user_id;
        $user = User::find($userId);

        $documentIds = $request->documents ?? [];
        $existingAccess = DocumentsAccess::where('user_id', $userId)->pluck('document_id')->toArray();

        $docsToAdd = array_diff($documentIds, $existingAccess);
        $docsToRemove = array_diff($existingAccess, $documentIds);

        DocumentsAccess::where('user_id', $userId)->delete();

        foreach ($documentIds as $documentId) {
            DocumentsAccess::create([
                'document_id' => $documentId,
                'user_id' => $userId,
            ]);
        }

        foreach ($docsToAdd as $documentId) {
            $doc = Documents::find($documentId);
            Alerts::create([
                'user_id' => auth()->id(),
                'role' => auth()->user()->role,
                'action' => 'updateAccessLimit',
                'type' => 'document',
                'message' => "a limité l'accès au document {$doc->title} (id: {$documentId}) à l'utilisateur {$user->name} (id: {$userId})"
            ]);
        }

        foreach ($docsToRemove as $documentId) {
            $doc = Documents::find($documentId);
            Alerts::create([
                'user_id' => auth()->id(),
                'role' => auth()->user()->role,
                'action' => 'updateAccessRetire',
                'type' => 'document',
                'message' => "a retiré l'accès au document {$doc->title} (id: {$documentId}) à l'utilisateur {$user->name} (id: {$userId})."
            ]);
        }

        return redirect()->route('utilisateurs')->with(['success' => "Les accès de l'utilisateur {$user->name} (" . $this->translateRole($user->role) . ") ont été mis à jour."]);
    }

    private function translateRole(string $role): string
    {
        return match ($role) {
            'admin' => 'admin',
            'manager' => 'responsable rh',
            'user' => 'employé',
            default => $role,
        };
    }

    public function AddEmploye(AddUseremploye $request)
    {
        $validated = $request->validated();

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('employes/photos', 'public');
        }

        $employe = Employe::create([
            'user_id' => $request->user_id,
            'email' => $validated['email'],
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
        ]);

        $documentPath = null;
        if ($request->hasFile('contract_document_path')) {
            $documentPath = $request->file('contract_document_path')->store('contracts', 'public');
        }

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

        return redirect()->route('utilisateurs')->with([
            'success' => 'Employé et contrat pour l\'employé avec le matricule ' . $employe->matricule . ' ajoutés avec succès.',
        ]);
    }

}