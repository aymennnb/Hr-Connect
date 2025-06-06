<?php

namespace App\Imports;

use App\Models\Sites;
use App\Models\Location;
use App\Models\Surface;
use App\Models\Alerts;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterImport;

class SitesImport implements ToModel, WithHeadingRow, WithEvents
{
    public int $count = 0;
    public array $sitesCreated = [];
    public $errors = [];

    // Tableau de correspondance entre les en-têtes Excel et les noms des champs
    protected $columnMappings = [
        // Sites
        'name' => 'name',
        'web' => 'web',
        'email' => 'email',
        'phone' => 'phone',
        'address' => 'address',
        'latitude' => 'latitude',
        'longitude' => 'longitude',
        'image' => 'image',
        'ville' => 'ville',
        'titre foncier' => 'titre_foncier',
        'superficie terrain' => 'superficie_terrain',
        'zoning urbanistique' => 'zoning_urbanistique',
        'consistance' => 'consistance',
        'surface gla' => 'surface_gla',
        'type site' => 'type_site',

        // Surface
        'total' => 'total',
        'vn' => 'vn',
        'show room dacia' => 'show_room_dacia',
        'show room renault' => 'show_room_renault',
        'show room nouvelle marque' => 'show_room_nouvelle_marque',
        'zone de preparation' => 'zone_de_preparation',
        'apv' => 'apv',
        'rms' => 'rms',
        'atelier mecanique' => 'atelier_mecanique',
        'atelier carrosserie' => 'atelier_carrosserie',
        'vo' => 'vo',
        'parking' => 'parking',

        // Location
        'exploitant' => 'exploitant',
        'bailleur' => 'bailleur',
        'date effet' => 'date_effet',
        'duree bail' => 'duree_bail',
        'loyer actuel' => 'loyer_actuel',
        'taux revision' => 'taux_revision',
        'prochaine revision' => 'prochaine_revision',
    ];

    /**
     * Récupérer la valeur d'une colonne en tenant compte des différentes façons d'écrire les en-têtes
     */
    protected function getColumnValue(array $row, string $field)
    {
        // Vérifier si le champ existe directement
        if (isset($row[$field])) {
            return $row[$field];
        }

        // Vérifier avec la correspondance sans underscore
        $fieldWithoutUnderscore = str_replace('_', ' ', $field);
        if (isset($row[$fieldWithoutUnderscore])) {
            return $row[$fieldWithoutUnderscore];
        }

        // Parcourir le tableau de correspondance pour trouver le champ
        foreach ($this->columnMappings as $excelHeader => $dbField) {
            if ($dbField === $field && isset($row[$excelHeader])) {
                return $row[$excelHeader];
            }
        }

        // Si aucune correspondance n'est trouvée, retourner null
        return null;
    }

    public function model(array $row)
    {
        $this->count++;

        try {
            $site = new Sites([
                'name'                => $this->getColumnValue($row, 'name'),
                'web'                 => $this->getColumnValue($row, 'web'),
                'email'               => $this->getColumnValue($row, 'email'),
                'phone'               => $this->getColumnValue($row, 'phone'),
                'address'             => $this->getColumnValue($row, 'address'),
                'latitude'            => $this->getColumnValue($row, 'latitude'),
                'longitude'           => $this->getColumnValue($row, 'longitude'),
                'image'               => $this->getColumnValue($row, 'image') ? $this->getColumnValue($row, 'image') : null,
                'ville'               => $this->getColumnValue($row, 'ville'),
                'titre_foncier'       => $this->getColumnValue($row, 'titre_foncier'),
                'superficie_terrain'  => $this->getColumnValue($row, 'superficie_terrain'),
                'zoning_urbanistique' => $this->getColumnValue($row, 'zoning_urbanistique'),
                'consistance'         => $this->getColumnValue($row, 'consistance'),
                'surface_gla'         => $this->getColumnValue($row, 'surface_gla'),
                'uploaded_by'         => Auth::id(),
                'type_site' => $this->getColumnValue($row, 'type_site')
                    ?: (
                    $this->getColumnValue($row, 'exploitant') !== null &&
                    $this->getColumnValue($row, 'bailleur') !== null &&
                    $this->getColumnValue($row, 'date_effet') !== null
                        ? 'location'
                        : 'propre'
                    )
            ]);

            $site->save();

            $this->sitesCreated[] = $site;

            $showRoomDacia = floatval($this->getColumnValue($row, 'show_room_dacia'));
            $showRoomRenault = floatval($this->getColumnValue($row, 'show_room_renault'));
            $showRoomNouvelleMarque = floatval($this->getColumnValue($row, 'show_room_nouvelle_marque'));
            $zoneDePreparation = floatval($this->getColumnValue($row, 'zone_de_preparation'));
            $atelierMecanique = floatval($this->getColumnValue($row, 'atelier_mecanique'));
            $atelierCarrosserie = floatval($this->getColumnValue($row, 'atelier_carrosserie'));
            $rms = floatval($this->getColumnValue($row, 'rms'));
            $vo = floatval($this->getColumnValue($row, 'vo'));
            $parking = floatval($this->getColumnValue($row, 'parking'));

            $vn = $showRoomDacia + $showRoomRenault + $showRoomNouvelleMarque;
            $apv = $atelierMecanique + $atelierCarrosserie;
            $total = $vn + $zoneDePreparation + $apv + $rms + $vo + $parking;

            $surface = new Surface([
                'site_id'                    => $site->id,
                'total'                      => $total,
                'vn'                         => $vn,
                'show_room_dacia'            => $showRoomDacia,
                'show_room_renault'          => $showRoomRenault,
                'show_room_nouvelle_marque'  => $showRoomNouvelleMarque,
                'zone_de_preparation'        => $zoneDePreparation,
                'apv'                        => $apv,
                'rms'                        => $rms,
                'atelier_mecanique'          => $atelierMecanique,
                'atelier_carrosserie'        => $atelierCarrosserie,
                'vo'                         => $vo,
                'parking'                    => $parking,
            ]);


            $surface->save();

            // Vérifier si les données de location existent
            $hasLocationData = $this->getColumnValue($row, 'exploitant') !== null ||
                $this->getColumnValue($row, 'bailleur') !== null ||
                $this->getColumnValue($row, 'date_effet') !== null;

            if ($hasLocationData) {
                $location = new Location([
                    'sitef_id'          => $site->id,
                    'exploitant'        => $this->getColumnValue($row, 'exploitant'),
                    'bailleur'          => $this->getColumnValue($row, 'bailleur'),
                    'date_effet'        => $this->getColumnValue($row, 'date_effet'),
                    'duree_bail'        => $this->getColumnValue($row, 'duree_bail'),
                    'loyer_actuel'      => $this->getColumnValue($row, 'loyer_actuel'),
                    'taux_revision'     => $this->getColumnValue($row, 'taux_revision'),
                    'prochaine_revision' => $this->getColumnValue($row, 'prochaine_revision'),
                ]);
                $location->save();
            }

            return $site;
        } catch (\Exception $e) {
            $this->errors[] = "Erreur à la ligne " . ($this->rowNumber ?? '?') . ": " . $e->getMessage();
            return null;
        }
    }

    public function registerEvents(): array
    {
        return [
            AfterImport::class => function (AfterImport $event) {
                foreach ($this->sitesCreated as $site) {
                    $savedSite = Sites::where('name', $site->name)
                        ->where('email', $site->email)
                        ->latest()
                        ->first();

                    if ($savedSite) {
                        Alerts::create([
                            'user_id' => Auth::id(),
                            'role' => Auth::user()->role,
                            'action' => 'add',
                            'type' => 'site',
                            'message' => "a ajouté un site avec le nom {$savedSite->name} et l'id {$savedSite->id}.",
                        ]);
                    }
                }
            },
        ];
    }
}
