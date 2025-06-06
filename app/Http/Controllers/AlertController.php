<?php

namespace App\Http\Controllers;

use App\Exports\LogsExport;
use App\Http\Requests\AlertInsertRequest;
use App\Models\Alerts;
use App\Models\Documents;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

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
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:admin,manager,user',
            'action' => 'required|string|max:255',
            'type' => 'required|string|in:user,document,site',
            'message' => 'required|string',
        ]);

        Alerts::create([
            'user_id' => $validated['user_id'],
            'role' => $validated['role'],
            'action' => $validated['action'],
            'type' => $validated['type'],
            'message' => $validated['message'],
        ]);
    }


    public function getExpiringDocuments()
    {
        $documents = Documents::whereNotNull('date_expiration')->get();

        $expiringDocuments = [];
        $today = Carbon::now();

        foreach ($documents as $document) {
            $expirationDate = Carbon::parse($document->date_expiration);
            $daysUntilExpiration = $today->diffInDays($expirationDate, false);

            if ($daysUntilExpiration >= 0 && $daysUntilExpiration <= 30) {
                $expiringDocuments[] = [
                    'id' => $document->id,
                    'name' => $document->name ?? 'Document #' . $document->id,
                    'date_expiration' => $document->date_expiration,
                    'days_until_expiration' => $daysUntilExpiration,
                    'is_critical' => $daysUntilExpiration <= 7
                ];
            }
        }

        return response()->json($expiringDocuments);
    }

    public function export(Request $request)
    {
        $role = $request->input('role', 'all');
        $type = $request->input('type', 'all');
        $action = $request->input('action', 'all');
        $startDate = $request->input('start_date', '');
        $endDate = $request->input('end_date', '');
        $nameSearch = $request->input('nomserch', '');
        $sortOrder = $request->input('date', 'recent');

        $filename = 'Logs_' . now()->format('d-m-Y_H-i-s') . '.xlsx';

        return Excel::download(
            new LogsExport($role, $type, $action, $startDate, $endDate, $nameSearch, $sortOrder),
            $filename
        );
    }

    public function exportCSV(Request $request)
    {
        $role = $request->input('role', 'all');
        $type = $request->input('type', 'all');
        $action = $request->input('action', 'all');
        $startDate = $request->input('start_date', '');
        $endDate = $request->input('end_date', '');
        $nameSearch = $request->input('nomserch', '');
        $sortOrder = $request->input('date', 'recent');

        $filename = 'Logs_' . now()->format('d-m-Y_H-i-s') . '.csv';

        return Excel::download(
            new LogsExport($role, $type, $action, $startDate, $endDate, $nameSearch, $sortOrder),
            $filename,
            \Maatwebsite\Excel\Excel::CSV
        );
    }
}
