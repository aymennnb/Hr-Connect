<?php

namespace App\Exports;

use App\Models\Documents;
use App\Models\Sites;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Carbon;

class DocumentsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $searchTerm;
    protected $siteIds;
    protected $startDate;
    protected $endDate;
    protected $expStartDate;
    protected $expEndDate;

    // Caching pour éviter des requêtes répétées
    protected $sitesCache = [];
    protected $usersCache = [];

    /**
     * Constructor with filter parameters
     */
    public function __construct($searchTerm = '', $siteIds = [], $startDate = '', $endDate = '', $expStartDate = '', $expEndDate = '')
    {
        $this->searchTerm = $searchTerm;
        $this->siteIds = $siteIds;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->expStartDate = $expStartDate;
        $this->expEndDate = $expEndDate;

        // Préchargement des données pour améliorer les performances
        $this->loadSites();
        $this->loadUsers();
    }

    /**
     * Précharge tous les sites pour éviter des requêtes multiples
     */
    protected function loadSites()
    {
        $sites = Sites::all();
        foreach ($sites as $site) {
            $this->sitesCache[$site->id] = $site->name;
        }
    }

    /**
     * Précharge tous les utilisateurs pour éviter des requêtes multiples
     */
    protected function loadUsers()
    {
        $users = User::all();
        foreach ($users as $user) {
            $this->usersCache[$user->id] = $user->name;
        }
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = Documents::select(
            "id", "title", "description", "expiration_date",
            "site_id", "uploaded_by", "created_at"
        );

        // Apply title search filter
        if (!empty($this->searchTerm)) {
            $query->where('title', 'like', '%' . $this->searchTerm . '%');
        }

        // Apply site filter
        if (!empty($this->siteIds)) {
            $query->whereIn('site_id', $this->siteIds);
        }

        // Apply creation date filters
        if (!empty($this->startDate)) {
            $query->whereDate('created_at', '>=', $this->startDate);
        }

        if (!empty($this->endDate)) {
            $query->whereDate('created_at', '<=', $this->endDate);
        }

        // Apply expiration date filters
        if (!empty($this->expStartDate)) {
            $query->whereDate('expiration_date', '>=', $this->expStartDate);
        }

        if (!empty($this->expEndDate)) {
            $query->whereDate('expiration_date', '<=', $this->expEndDate);
        }

        return $query->get();
    }

    /**
     * Map each row to format data before export
     *
     * @param mixed $row
     * @return array
     */
    public function map($row): array
    {
        // Format de la date d'expiration
        $expirationDate = !empty($row->expiration_date) ? Carbon::parse($row->expiration_date)->format('d/m/Y') : 'Non spécifié';

        // Format de la date de création
        $createdAtDate = Carbon::parse($row->created_at)->format('d/m/Y H:i');

        // Obtenir le nom du site au lieu de l'ID
        $siteName = $this->sitesCache[$row->site_id] ?? 'Site inconnu';

        // Obtenir le nom de l'utilisateur au lieu de l'ID
        $uploadedByName = $this->usersCache[$row->uploaded_by] ?? 'Utilisateur inconnu';

        return [
            $row->id,
            $row->title,
            $row->description,
            $expirationDate,
            $siteName,
            $uploadedByName,
            $createdAtDate
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
            "ID",
            "Titre",
            "Description",
            "Date d'expiration",
            "Site Associe",
            "Ajoute par",
            "Date de creation"
        ];
    }
}
