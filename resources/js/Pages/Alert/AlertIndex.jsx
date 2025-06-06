import React, { useEffect, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {TbFileTypeCsv, TbPlayerTrackNextFilled, TbZoomReset} from "react-icons/tb";
import {FaBackward, FaFileShield} from "react-icons/fa6";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import {TiDocumentDelete} from "react-icons/ti";
import {CiExport} from "react-icons/ci";
import {HiDocumentAdd} from "react-icons/hi";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from "dayjs";

export default function AlertIndex({ auth, alerts, users, documents, filters }) {
    const { data, setData } = useForm({
        role: 'all',
        action: 'all',
        type: 'all',
        date: 'recent',
        start_date: '',
        end_date: '',
        nomserch: ''
    });

    const width = useWindowWidth();

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredAlerts, setFilteredAlerts] = useState([]);

    const [availableTypes, setAvailableTypes] = useState([]);
    const [availableActions, setAvailableActions] = useState([]);

    const filterRelations = {
        roles: {
            all: ["conges", "salaires", "departements","utilisateurs"],
            admin: ["conges", "salaires", "departements","utilisateurs"],
            manager: ["conges", "salaires", "departements"],
            user: []
        },
        types: {
            conge: ["add", "update", "delete"],
            salaire: ["add", "update", "delete"],
            user: ["add", "update", "delete"]
        }
    };

    const resetFilters = () => {
        setData({
            ...data,
            role: 'all',
            action: 'all',
            type: 'all',
            date: 'recent',
            start_date: '',
            end_date: '',
            nomserch: ''
        });
        setCurrentPage(1);
    };

    useEffect(() => {
        const types = filterRelations.roles[data.role] || [];
        setAvailableTypes(types);

        if (data.type !== 'all' && !types.includes(data.type)) {
            setData('type', 'all');
        }
    }, [data.role]);

    useEffect(() => {
        if (data.type === 'all') {
            const allActions = Object.values(filterRelations.types).flat();
            setAvailableActions([...new Set(allActions)]);
        } else {
            const actions = filterRelations.types[data.type] || [];
            setAvailableActions(actions);

            if (data.action !== 'all' && !actions.includes(data.action)) {
                setData('action', 'all');
            }
        }
    }, [data.type]);

    useEffect(() => {
        if (!alerts) return;

        let filtered = [...alerts];

        if (data.role !== 'all') {
            filtered = filtered.filter(alert => {
                const user = users.find(u => u.id === alert.user_id);
                return user && user.role === data.role;
            });
        }

        if (data.type !== 'all') {
            filtered = filtered.filter(alert => alert.type === data.type);
        }

        if (data.action !== 'all') {
            filtered = filtered.filter(alert => alert.action === data.action);
        }

        if (data.date === 'recent') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (data.date === 'ancien') {
            filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(alert => new Date(alert.created_at) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(alert => new Date(alert.created_at) <= endDate);
        }

        if (data.nomserch) {
            filtered = filtered.filter(alert => {
                const user = users.find(u => u.id === alert.user_id);
                return user && user.name.toLowerCase().includes(data.nomserch.toLowerCase());
            });
        }

        setFilteredAlerts(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors d'un nouveau filtrage
    }, [data, alerts, users]);

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAlerts.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredAlerts.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const alertsPerPageOptions = [5, 10, 20, 25, 50, 100, 150, 200, 300, 400, 600, 1000];
    const totalAlerts = filteredAlerts.length;
    const availableOptions = alertsPerPageOptions.filter(option => option <= totalAlerts || option === alertsPerPageOptions[0]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Initialiser filteredAlerts avec alerts au chargement initial
    useEffect(() => {
        if (alerts) {
            // Trier les alertes par date (plus récentes d'abord) au chargement initial
            const sortedAlerts = [...alerts].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );
            setFilteredAlerts(sortedAlerts);
        }
    }, []);

    // Fonction pour traduire les valeurs d'action en texte pour l'interface
    const getActionLabel = (actionValue) => {
        const actionLabels = {
            'connecte': 'Connexion',
            'add': 'Ajout',
            'update': 'Modification',
            'delete': 'Suppression',
            'updateAccessRetire': 'Retirer l\'accès',
            'updateAccessLimit': 'Limiter l\'accès',
            'reset': 'Réinitialisation',
            'updaterole': 'Changement du rôle',
            'export': 'Export',
            'consultation': 'Consultation'
        };
        return actionLabels[actionValue] || actionValue;
    };

    const getTypeLabel = (typeValue) => {
        const typeLabels = {
            'document': 'Document',
            'site': 'Site',
            'user': 'Utilisateur'
        };
        return typeLabels[typeValue] || typeValue;
    };

    const handleExportCSV = () => {
        const dataToExportCSV = filteredAlerts.map((alert) => {
            const user = users.find(user => user.id === alert.user_id);
            const userRole = user?.role || "inconnu";
            const userName = user?.name || "Utilisateur inconnu";

            let fullMessage = "";
            if (userRole === "admin") {
                fullMessage = `L'admin ${userName} ${alert.message}`;
            } else if (userRole === "manager") {
                fullMessage = `Le Responsable RH ${userName} ${alert.message}`;
            } else {
                fullMessage = `L'employé ${userName} ${alert.message}`;
            }

            return {
                Message: fullMessage,
                "Date et Heure": dayjs(alert.created_at).format("DD/MM/YYYY HH:mm:ss")
            };
        });

        // Convertir en CSV
        const ws = XLSX.utils.json_to_sheet(dataToExportCSV);
        const csvOutput = XLSX.utils.sheet_to_csv(ws, { FS: ',', RS: '\n' });

        // Ajouter BOM UTF-8 pour Afficher les accents correctement
        const csvWithBom = '\uFEFF' + csvOutput;

        const now = dayjs().format("YYYY-MM-DD_HH-mm-ss");
        const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `alertes_${now}.csv`);
    };


    const handleExport = () => {
        const dataToExport = filteredAlerts.map((alert) => {
            const user = users.find(user => user.id === alert.user_id);
            const userRole = user?.role || "inconnu";
            const userName = user?.name || "Utilisateur inconnu";

            // Créer le message complet selon le rôle
            let fullMessage = "";
            if (userRole === "admin") {
                fullMessage = `L'admin ${userName} ${alert.message}`;
            } else if (userRole === "manager") {
                fullMessage = `Le manager ${userName} ${alert.message}`;
            } else {
                fullMessage = `${userName} ${alert.message}`;
            }

            return {
                Message: fullMessage,
                "Date et Heure": dayjs(alert.created_at).format("DD/MM/YYYY HH:mm:ss")
            };
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Alertes');
        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const now = dayjs().format("YYYY-MM-DD_HH-mm-ss");
        saveAs(new Blob([buf], { type: 'application/octet-stream' }), `alertes_${now}.xlsx`);
    };


    return (
        <Authenticated user={auth.user} header={<h2>Jornaux</h2>}>
            <Head title="Jornaux" />

            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Liste des Jornaux</h3>
                                {width < 550 ? (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleExport}
                                        title="Exporter les Logs Filtrés"
                                        className="px-2 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                    >
                                        <CiExport />
                                    </button>
                                    <button
                                        onClick={handleExportCSV}
                                        title="Exporter les Logs Filtrés"
                                        className="px-2 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                    >
                                        <TbFileTypeCsv/>
                                    </button>
                                </div>) :
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleExport}
                                            title="Exporter les Logs Filtrés  au format Exel"
                                            className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                        >
                                            <CiExport />
                                        </button>
                                        <button
                                            onClick={handleExportCSV}
                                            title="Exporter les Logs filtrés au format CSV"
                                            className="px-2 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                        >
                                            <TbFileTypeCsv/>
                                        </button>
                                    </div>
                                }
                            </div>

                            {/* Première ligne de filtres */}
                            <div className="flex flex-wrap items-end gap-3 mb-3 relative z-0">
                                {/* Filtre par rôle */}
                                <div className="flex-1 min-w-[170px]">
                                    <label htmlFor="roleFilter" className="text-xs font-medium text-gray-700 mb-1 block">Filtrer par rôle :</label>
                                    <select
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="roleFilter"
                                        name="role"
                                        value={data.role}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">Tous</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="user">Utilisateur</option>
                                    </select>
                                </div>

                                {/* Filtre par type - dynamique en fonction du rôle sélectionné */}
                                <div className="flex-1 min-w-[170px]">
                                    <label htmlFor="typeFilter" className="text-xs font-medium text-gray-700 mb-1 block">Filtrer par type :</label>
                                    <select
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="typeFilter"
                                        name="type"
                                        value={data.type}
                                        onChange={handleFilterChange}
                                        disabled={data.role === 'user' || availableTypes.length === 0}
                                    >
                                        <option value="all">Tous</option>
                                        {availableTypes.map(type => (
                                            <option key={type} value={type}>
                                                {getTypeLabel(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtre par action - dynamique en fonction du type sélectionné */}
                                <div className="flex-1 min-w-[170px]">
                                    <label htmlFor="actionFilter" className="text-xs font-medium text-gray-700 mb-1 block">Filtrer par action :</label>
                                    <select
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="actionFilter"
                                        name="action"
                                        value={data.action}
                                        onChange={handleFilterChange}
                                        disabled={availableActions.length === 0}
                                    >
                                        <option value="all">Toutes</option>
                                        {availableActions.map(action => (
                                            <option key={action} value={action}>
                                                {getActionLabel(action)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtre par ordre de date */}
                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="dateFilter" className="text-xs font-medium text-gray-700 mb-1 block">Filtrer par date :</label>
                                    <select
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="dateFilter"
                                        name="date"
                                        value={data.date}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="recent">Plus Récent</option>
                                        <option value="ancien">Plus Ancien</option>
                                    </select>
                                </div>

                                {/* Dates de début et fin */}
                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1 block">Date de début :</label>
                                    <input
                                        type="date"
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="start_date"
                                        name="start_date"
                                        value={data.start_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1 block">Date de fin :</label>
                                    <input
                                        type="date"
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        id="end_date"
                                        name="end_date"
                                        value={data.end_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            {/* Deuxième ligne de filtres */}
                            <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
                                {/* Recherche par nom */}
                                <div className={width < 500 ? "relative flex-1 w-full" : "flex-1 min-w-[150px]"}>
                                    <label htmlFor="nomserch" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par nom :</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            id="nomserch"
                                            name="nomserch"
                                            value={data.nomserch}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Rechercher par nom..."
                                        />
                                    </div>
                                </div>

                                {/* Items par page et bouton reset */}
                                <div className={width < 500 ? "flex-2 w-full" : "flex-2 min-w-[150px]"}>
                                    <label className="text-xs font-medium text-gray-700 mb-1 block">Par page :</label>
                                    <div className="flex items-center gap-2">
                                        <select
                                            id="itemsPerPage"
                                            className="w-full h-[30px] px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1); // Réinitialiser à la première page
                                            }}
                                        >
                                            {availableOptions.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={resetFilters}
                                            title="Réinitialiser le Filtre"
                                            className="h-[30px] px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center"
                                        >
                                            <TbZoomReset className="mr-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                            <table className="table-auto w-full text-sm text-left text-gray-500">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Corps de l'alerte</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Date et Heure</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAlerts && filteredAlerts.length > 0 ? (
                                    getCurrentPageItems().map((alert) => {
                                        const actor = users.find(user => user.id === alert.user_id);
                                        const actorName = actor?.name || "Inconnu";
                                        const actorRole = actor?.role || "inconnu";

                                        return (
                                            <tr key={alert.id} className="hover:bg-gray-50 text-center">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {actorRole === "admin"
                                                        ? `L'admin ${actorName} ${alert.message}`
                                                        : actorRole === "manager"
                                                            ? `Le responsable RH ${actorName} ${alert.message}`
                                                            : actorRole === "user"
                                                                ? `L'employé ${actorName} ${alert.message}`
                                                                : actorRole === "superadmin"
                                                                    ? `${actorName} ${alert.message}`
                                                                    : `L'employé ${actorName} ${alert.message}`}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {new Date(alert.created_at).toLocaleString("fr-FR", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                                            <span className="italic text-gray-400">Aucune alerte trouvée.</span>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredAlerts && filteredAlerts.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredAlerts.length} alerte(s) trouvée(s)
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === 1
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <FaBackward/>{/* Précédent*/}
                                    </button>
                                    <span className="px-3 py-1 bg-gray-100 rounded-md">
                                        Page {currentPage} sur {Math.ceil(filteredAlerts.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredAlerts.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredAlerts.length / itemsPerPage)
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <TbPlayerTrackNextFilled/> {/*Suivant*/}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
