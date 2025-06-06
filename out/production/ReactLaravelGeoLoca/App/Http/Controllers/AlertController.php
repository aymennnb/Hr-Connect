<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlertInsertRequest;
use App\Models\Alerts;
use App\Models\Documents;
use App\Models\User;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index(Request $request)
    {
        $query = Alerts::query();
        $users = User::all();
        $documents = Documents::all();

        if ($request->has('nomserch') && $request->nomserch !== 'all') {
            $userIds = User::where('name', 'like', '%' . $request->nomserch . '%')->pluck('id');
            $query->whereIn('user_id', $userIds);
        }

        if ($request->has('role') && $request->role !== 'all') {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role', $request->role);
            });
        }

        if ($request->has('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('date') && $request->date !== 'all') {
            $query->orderBy('created_at', $request->date === 'recent' ? 'desc' : 'asc');
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        }

        $alerts = $query->get();

        return inertia('Alert/AlertIndex', [
            'alerts' => $alerts,
            'users' => $users,
            'documents' => $documents,
            'filters' => $request->only(['role', 'action', 'type', 'date', 'start_date', 'end_date']),
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|string|in:admin,manager,user',
            'user_id' => 'required|exists:users,id',
            'action' => 'required|string|max:255',
            'type' => 'required|string|in:user,document,site',
            'elem_id' => 'required|integer',
            'message'=>''
        ]);

        Alerts::create($validated);

        return response()->json(['message' => 'Alerte enregistrée avec succès.']);
    }
}
