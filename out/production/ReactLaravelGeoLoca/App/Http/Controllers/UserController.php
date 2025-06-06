<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserUpdateRequest;
use App\Models\Alerts;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(){
        $users = User::all();

        return Inertia::render('Utilisateurs/IndexUsers', [
            'users' => $users
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
            'message' => "a ajouté un nouveau {$user->role} avec le nom {$user->name} et l'ID {$user->id}.",
        ]);

        return redirect()->route('utilisateurs')->with(['success' => "L'utilisateur {$user->name} a été ajouté avec succès."]);
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
            'message' => "a changé le rôle d'un acteur avec le nom {$user->name} et l'ID {$user->id} de {$ancien_role} à " . ($request->role === 'admin' ? 'admin' : ($request->role === 'manager' ? 'manager' : 'utilisateur')) . ".",
        ]);

        return redirect('utilisateurs')->with(['success'=> "Le rôle de l'utilisateur {$user->name} a été mis à jour de {$ancien_role} à {$user->role}."]);
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
            'message' => " a réinitialisé le mot de passe d'un " . ($user->role === 'admin' ? "admin" : ($user->role === 'manager' ? 'manager' : 'utilisateur')) . " avec le nom {$user ->name} et L'id " . ($user ->id) . ".",
        ]);

        return redirect('utilisateurs')->with(['success' => "Le mot de passe de {$user->name} a été réinitialisé à la valeur par defaut."]);
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
            return redirect('utilisateurs')->with(['error' => 'Utilisateur non trouvé.']);
        }

        $item->name = $request->name;
        $item->email = $request->email;
        $item->role = $request->role;
        $item->save();

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'update',
            'type' => 'user',
            'message' => " a modifié les informations d'un " . ($item->role === 'admin' ? "admin" : ($item->role === 'manager' ? 'manager' : 'utilisateur')) . " avec le nom " .($item->name). " et L'id " . ($item->id) . ".",
        ]);

        return redirect('utilisateurs')->with(['success' => "L'utilisateur {$item->name} a été mis à jour."]);
    }


    public function delete($id)
    {
        $item = User::findOrFail($id);

        Alerts::create([
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'action' => 'delete',
            'type' => 'user',
            'message' => " a supprimé un " . ($item->role === 'admin' ? "admin" : ($item->role === 'manager' ? 'manager' : 'utilisateur')) . " avec le nom {$item->name} et L'id " . ($item->id) . ".",
        ]);

        $item->delete();

        return redirect('utilisateurs')->with(['success' => "L'utilisateur {$item->name} a été supprimé avec succès."]);
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
                    'message' => " a supprimé un " .
                        ($user->role === 'admin' ? "admin" :
                            ($user->role === 'manager' ? 'manager' : 'utilisateur')) .
                        " avec le nom {$user->name} et l'ID {$user->id}.",
                ]);

                $user->delete();
            }

            return redirect()->route('utilisateurs')->with(['success' => 'Les utilisateurs sélectionnés ont été supprimés.']);
        }

        return redirect()->route('utilisateurs')->with(['error' => 'Aucun utilisateur sélectionné pour la suppression.']);
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
                'message' => "a changé le rôle d'un acteur avec le nom {$user->name} et l'id {$user->id} de {$ancien_role} à " .
                    ($request->role_group === 'admin' ? 'admin' : ($request->role_group === 'manager' ? 'manager' : 'utilisateur')) . ".",
            ]);
        }

        return redirect()->route('utilisateurs')->with(['success' => 'Les rôles des utilisateurs sélectionnés ont été mis à jour.']);
    }
}
