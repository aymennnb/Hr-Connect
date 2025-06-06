<?php

namespace App\Exports;

use App\Models\Alerts;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Carbon;

class LogsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $role;
    protected $type;
    protected $action;
    protected $startDate;
    protected $endDate;
    protected $nameSearch;
    protected $sortOrder;

    // Cache pour éviter des requêtes répétées
    protected $usersCache = [];

    /**
     * Constructor with filter parameters
     */
    public function __construct($role = 'all', $type = 'all', $action = 'all', $startDate = '', $endDate = '', $nameSearch = '', $sortOrder = 'recent')
    {
        $this->role = $role;
        $this->type = $type;
        $this->action = $action;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->nameSearch = $nameSearch;
        $this->sortOrder = $sortOrder;

        $this->loadUsers();
    }

    /**
     * Précharge tous les utilisateurs pour éviter des requêtes multiples
     */
    protected function loadUsers()
    {
        $users = User::all(['id', 'name', 'role']);
        foreach ($users as $user) {
            $this->usersCache[$user->id] = [
                'name' => $user->name,
                'role' => $user->role
            ];
        }
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = Alerts::select('*');

        // Apply date filters
        if (!empty($this->startDate)) {
            $query->whereDate('created_at', '>=', $this->startDate);
        }

        if (!empty($this->endDate)) {
            // Ajouter une journée complète pour inclure toute la journée de fin
            $endDate = Carbon::parse($this->endDate)->endOfDay();
            $query->whereDate('created_at', '<=', $endDate);
        }

        // Apply type filter
        if ($this->type !== 'all') {
            $query->where('type', $this->type);
        }

        // Apply action filter
        if ($this->action !== 'all') {
            $query->where('action', $this->action);
        }

        // Sort by date
        if ($this->sortOrder === 'recent') {
            $query->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'asc');
        }

        $alerts = $query->get();

        if ($this->role !== 'all' || !empty($this->nameSearch)) {
            $alerts = $alerts->filter(function ($alert) {
                $user = $this->usersCache[$alert->user_id] ?? null;

                // Filter by role
                if ($this->role !== 'all' && (!$user || $user['role'] !== $this->role)) {
                    return false;
                }

                // Filter by name search
                if (!empty($this->nameSearch) && (!$user || stripos($user['name'], $this->nameSearch) === false)) {
                    return false;
                }

                return true;
            });
        }

        return $alerts;
    }

    /**
     * Map each row to format data before export
     *
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        $user = $this->usersCache[$row->user_id] ?? null;
        $userName = $user ? $user['name'] : 'Utilisateur inconnu';
        $userRole = $user ? $user['role'] : 'inconnu';

        $createdAt = Carbon::parse($row->created_at)->format('d/m/Y H:i:s');

        $actionLabels = [
            'connecte' => 'Connexion',
            'add' => 'Ajout',
            'update' => 'Modification',
            'delete' => 'Suppression',
            'updateAccessRetire' => 'Retirer l\'accès',
            'updateAccessLimit' => 'Limiter l\'accès',
            'reset' => 'Réinitialisation',
            'updaterole' => 'Changement du rôle',
            'export' => 'Export',
            'consultation' => 'Consultation'
        ];
        $actionLabel = $actionLabels[$row->action] ?? $row->action;

        $typeLabels = [
            'document' => 'Document',
            'site' => 'Site',
            'user' => 'Utilisateur'
        ];
        $typeLabel = $typeLabels[$row->type] ?? $row->type;

        $fullMessage = "";
        switch ($userRole) {
            case 'admin':
                $fullMessage = "L'admin {$userName} {$row->message}";
                break;
            case 'manager':
                $fullMessage = "Le manager {$userName} {$row->message}";
                break;
            default:
                $fullMessage = "{$userName} {$row->message}";
        }

        return [
            $fullMessage,
            $createdAt
        ];
    }

    /**
     * Set column headings
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            "Message",
            "Date et Heure"
        ];
    }
}
