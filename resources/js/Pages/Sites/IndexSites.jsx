import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Pagination from "@/Components/Pagination";
import ConfirmDeleteSite from "@/Components/ConfirmDeleteSite";
import ConfirmSitesDelete from "@/Components/ConfirmSitesDelete";
import AddSite from "@/Pages/Sites/AddSite"
import EditSite from "@/Pages/Sites/EditSite"
import Details from "@/Pages/Sites/Details"
import ImportSitesXLSX from "@/Pages/Sites/AddFileXLSX";
import ModalWrapper from "@/Components/ModalWrapper";
import toast from 'react-hot-toast';
import {TbPlayerTrackNextFilled, TbZoomReset} from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { TbHomeEdit } from "react-icons/tb";
import { TiDeleteOutline } from "react-icons/ti";
import { BsHouseAdd } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { TfiImport } from "react-icons/tfi";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import MultiSelectDropdown from "@/Components/MultiSelectDropdown";



function IndexSites({ auth, sites, documents, locations,flash,users,surfaces}) {
    const { data, setData, post, get, delete: destroy } = useForm({
        sites_ids: [],
        searchTerm: '',
        address: '',
        start_date: '',
        end_date: '',
        type_site: '',
        uploaded_by: ''
    });

    const width = useWindowWidth();

    const [showAddForm, setShowAddForm] = useState(false);

    const [siteToDelete, setSiteToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [siteToEdit, setsiteToEdit] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [siteToShowDetails, setSiteToShowDetails] = useState(null);

    const [showSitesDelete, setShowSitesDelete] = useState(false);

    // Ajout pour la pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredSites, setFilteredSites] = useState([]);

    const [showAddFileForm,setshowAddFileForm] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const selectedSitesTodelete = sites.filter((site) =>
        data.sites_ids.includes(site.id)
    );

    const resetFilters = () => {
        setData({
            ...data,
            searchTerm: '',
            address: '',
            start_date: '',
            end_date: '',
            type_site: '',
            uploaded_by: ''
        });
        setCurrentPage(1);
    };

    // Fonction pour filtrer les sites
    useEffect(() => {
        if (!sites) return;

        let filtered = sites.filter(site =>
            (!data.searchTerm || (site.name && site.name.toLowerCase().includes(data.searchTerm.toLowerCase()))) &&
            (!data.address || (site.address && site.address.toLowerCase().includes(data.address.toLowerCase()))) &&
            (!data.type_site || site.type_site === data.type_site) &&  // Filtrage par type de site
            (!data.uploaded_by || Number(site.uploaded_by) === Number(data.uploaded_by))  // Filtrage par personne qui a ajouté
        );

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(site => new Date(site.created_at) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(site => new Date(site.created_at) <= endDate);
        }

        if (selectedUsers.length > 0) {
            filtered = filtered.filter(site => selectedUsers.includes(site.uploaded_by));
        }

        setFilteredSites(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    }, [data.searchTerm, data.address, data.start_date,selectedUsers, data.end_date, data.type_site, data.uploaded_by, sites]);

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSites.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredSites.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectSite = (siteId) => {
        if (data.sites_ids.includes(siteId)) {
            setData("sites_ids", data.sites_ids.filter((id) => id !== siteId));
        } else {
            setData("sites_ids", [...data.sites_ids, siteId]);
        }
    };

    const handleSitesDelete = () => {
        if (data.sites_ids.length === 0) {
            toast.error("Veuillez sélectionner au moins un site.");
            return;
        }

        // Trouver tous les documents liés aux sites sélectionnés
        const linkedDocs = data.sites_ids
            .flatMap(siteId => documents.filter(doc => doc.site_id === siteId))
            // éviter doublons si plusieurs sites partagent mêmes docs (optionnel)
            .reduce((acc, doc) => {
                if (!acc.some(d => d.id === doc.id)) acc.push(doc);
                return acc;
            }, []);

        if (linkedDocs.length > 0) {
            const maxDocuments = 5;
            const displayedDocuments = linkedDocs.slice(0, maxDocuments);
            const remainingDocuments = linkedDocs.length - maxDocuments > 0;

            const documentList = displayedDocuments
                .map(doc => `• ${doc.title}`)
                .join('\n');

            const additionalMessage = remainingDocuments ? "\n...\n" : "";

            toast.error(
                `Impossible de supprimer certains sites car ils sont liés à ${linkedDocs.length} document${linkedDocs.length > 1 ? "s" : ""} :\n${documentList}${additionalMessage}\n\nVeuillez d'abord supprimer ces documents.`,
                { duration: 10000 }
            );

            setShowSitesDelete(false);
            return;
        }

        // Pas de documents liés, on peut supprimer les sites
        post(route('sites.SitesDelete'), {
            onSuccess: () => {
                setData("sites_ids", []);
            }
        });

        setShowSitesDelete(false);
    };

    const handleDeleteClick = (site) => {
        setSiteToDelete(site);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (!siteToDelete) return;

        // Trouver les documents liés au site à supprimer
        const linkedDocs = documents.filter(doc => doc.site_id === siteToDelete.id);

        if (linkedDocs.length > 0) {
            // Extraire les titres des documents liés
            const linkedDocTitles = linkedDocs.map(doc => doc.title).join('\n- ');

            toast.error(
                `Impossible de supprimer le site ${siteToDelete.name} car il est lié à ${linkedDocs.length} document${linkedDocs.length > 1 ? "s" : ""}.\n\nVeuillez d'abord supprimer ${linkedDocs.length > 1 ? "ces documents" : "ce document"}.`,
                {
                    duration: 10000,
                }
            );
            setIsModalOpen(false);
            setSiteToDelete(null);
            return;
        }

        // Pas de documents liés, suppression possible
        destroy(`/sites/delete/${siteToDelete.id}`);

        setIsModalOpen(false);
        setSiteToDelete(null);
    };


    const cancelDelete = () => {
        setIsModalOpen(false);
        setSiteToDelete(null);
    };

    // Options pour le nombre d'éléments par page
    const sitesPerPageOptions = [5, 10, 20, 25, 50, 100, 150,200,300,400,600,1000];
    const totalSites = filteredSites.length;
    const availableOptions = sitesPerPageOptions.filter(option => option <= totalSites || option === sitesPerPageOptions[0]);

    // Initialiser filteredSites avec sites au chargement
    useEffect(() => {
        if (sites) {
            setFilteredSites(sites);
        }
    }, [sites]);

    useEffect(() => {
        if (flash.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const typeLabels = {
        location: "Loué",
        propre: "Propriété",
    };

    const handleFilterSubmit = () => {
        const filters = {
            ...data,
            uploaded_by: selectedUsers,
        };
    };

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sites</h2>}>
            <Head title="Sites" />
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Liste des sites</h3>
                            {width < 550 ?
                                <div className="flex space-x-3">
                                    {data.sites_ids.length > 0 && (
                                        <>
                                            <button
                                                onClick={() => setShowSitesDelete(true)}
                                                disabled={data.sites_ids.length === 0}
                                                title={`Supprimer ${data.sites_ids.length} site${data.sites_ids.length > 1 ? 's' : ''} sélectionné${data.sites_ids.length > 1 ? 's' : ''}`}
                                                className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                            >
                                                <TiDeleteOutline/>{/*Supprimer*/}
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setshowAddFileForm(true)}
                                        title="Importer des Fichiers des Sites"
                                        className="px-3 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                    >
                                        <TfiImport/>
                                    </button>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Ajouter un nouveau Site"
                                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        <BsHouseAdd/>{/*Ajouter un Site*/}
                                    </button>
                                </div> :
                                <div className="flex space-x-3">
                                    {data.sites_ids.length > 0 && (
                                        <>
                                            <button
                                                onClick={() => setShowSitesDelete(true)}
                                                disabled={data.sites_ids.length === 0}
                                                title={`Supprimer ${data.sites_ids.length} site${data.sites_ids.length > 1 ? 's' : ''} sélectionné${data.sites_ids.length > 1 ? 's' : ''}`}
                                                className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                            >
                                                <TiDeleteOutline/>{/*Supprimer*/}
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setshowAddFileForm(true)}
                                        title="Importer des Fichiers des Sites"
                                        className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:text-green-900 transition"
                                    >
                                        <TfiImport/>
                                    </button>
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Ajouter un nouveau Site"
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        <BsHouseAdd/>{/*Ajouter un Site*/}
                                    </button>
                                </div>
                            }
                        </div>

                        <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
                            {/* Filtre par nom */}
                            <div className="relative flex-1 min-w-[200px]">
                                <label htmlFor="searchTerm" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par nom:</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        id="searchTerm"
                                        name="searchTerm"
                                        value={data.searchTerm}
                                        onChange={handleFilterChange}
                                        className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Nom du site..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par adresse */}
                            <div className="relative flex-1 min-w-[200px]">
                                <label htmlFor="address" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par adresse:</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        onChange={handleFilterChange}
                                        className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Adresse..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par type de site */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="type_site" className="text-xs font-medium text-gray-700 mb-1 block">Type de site:</label>
                                <select
                                    id="type_site"
                                    name="type_site"
                                    value={data.type_site}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tous les types</option>
                                    <option value="location">Loué</option>
                                    <option value="propre">Propriété</option>
                                </select>
                            </div>

                            {/* Filtre par personne qui a ajouté */}
                            <div className="relative flex-1 min-w-[200px] z-20">
                                <MultiSelectDropdown
                                    label="Ajouté par :"
                                    options={users}
                                    selectedOptions={selectedUsers}
                                    setSelectedOptions={setSelectedUsers}
                                />
                            </div>

                            {/* Dates de création */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1 block">Création début:</label>
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
                                <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1 block">Création fin:</label>
                                <input
                                    type="date"
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    id="end_date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Éléments par page et bouton réinitialiser */}
                            <div className="flex-1 min-w-[200px]">
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

                        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                            <table className="border-collapse table-auto w-full whitespace-nowrap">
                                <thead>
                                <tr className="text-left bg-gray-50">
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">

                                    </th><th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Adresse
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type de site
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Zoning urbanistique
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Superficie du Terrain
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ajouté par
                                    </th>
                                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentPageItems().length > 0 ? (
                                    getCurrentPageItems().map((site) => (
                                        <tr key={site.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                <input
                                                    type="checkbox"
                                                    checked={data.sites_ids.includes(site.id)}
                                                    onChange={() => handleSelectSite(site.id)}
                                                />
                                            </td>
                                            <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                {site.image ? (
                                                    <img
                                                        src={`/storage/${site.image}`}
                                                        alt={site.name}
                                                        style={{ width: '65px', height: '65px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '65px',
                                                            height: '65px',
                                                            backgroundColor: '#e5e7eb',
                                                            borderRadius: '10px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '8px',
                                                            color: '#9ca3af',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        <span className="italic text-gray-400">Aucune image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.name ? site.name : <span className="italic text-gray-400">Nom non défini</span>}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.address ? site.address : <span className="italic text-gray-400">Aucune adresse définie</span>}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {typeLabels[site.type_site] ? typeLabels[site.type_site] : <span className="italic text-gray-400">Type inconnu</span>}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.zoning_urbanistique ? site.zoning_urbanistique : <span className="italic text-gray-400">Aucune zone définie</span>}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {site.superficie_terrain ? site.superficie_terrain + ' m²' : <span className="italic text-gray-400">Aucune superficie du terrain définie</span>}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {users.find(user => Number(user.id) === Number(site.uploaded_by))?.name || <span className="italic text-gray-400">Non trouvé</span>}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2 justify-center">
                                                    <button
                                                        onClick={() => {
                                                            setShowDetailModal(true);
                                                            setSiteToShowDetails(site);
                                                        }}
                                                        title={`Consulter les détails du site ${site.name}`}
                                                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                    >
                                                        <CgDetailsMore/>{/*Détails*/}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowEditModal(true);
                                                            setsiteToEdit(site);
                                                        }}
                                                        title={`Modifier les informations du site ${site.name}`}
                                                        className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                    >
                                                        <TbHomeEdit/>{/*Modifier*/}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(site)}
                                                        title={`Supprimer le site ${site.name}`}
                                                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                    >
                                                        <TiDeleteOutline/>{/*Supprimer*/}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                            <span className="italic text-gray-400">Aucun site trouvé.</span>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredSites.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredSites.length} site(s) trouvé(s)
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
                                        <FaBackward/>
                                    </button>
                                    <span className="px-3 py-1 bg-gray-100 rounded-md">
                                        Page {currentPage} sur {Math.ceil(filteredSites.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredSites.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredSites.length / itemsPerPage)
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <TbPlayerTrackNextFilled/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {showAddFileForm && (
                        <ModalWrapper title="Importation groupée des sites" onClose={() => setshowAddFileForm(false)}>
                            <ImportSitesXLSX auth={auth} setshowAddFileForm={setshowAddFileForm} />
                        </ModalWrapper>
                    )}
                    {showAddForm && (
                        <ModalWrapper title="Ajouter un nouveau site" onClose={() => setShowAddForm(false)}>
                            <AddSite auth={auth} setShowAddForm={setShowAddForm} />
                        </ModalWrapper>
                    )}
                    {showEditModal && (
                        <ModalWrapper title={`Modifier les information du site ${siteToEdit.name}`} onClose={() => setShowEditModal(false)}>
                            <EditSite auth={auth}
                                      siteToEdit={siteToEdit}
                                      locationifExist={siteToEdit ? locations.find((item) => item.sitef_id === siteToEdit.id): null}
                                      surface={siteToEdit ? surfaces.find((item) => item.site_id === siteToEdit.id): null}
                                      setShowEditModal={setShowEditModal} />
                        </ModalWrapper>
                    )}
                    {showDetailModal && (
                        <ModalWrapper title={`Détails du Site ${siteToShowDetails.name}`} onClose={() => setShowDetailModal(false)}>
                            <Details auth={auth}
                                     documents={documents}
                                     surface={siteToShowDetails ? surfaces.find((item) => item.site_id === siteToShowDetails.id): null}
                                     siteDetails={siteToShowDetails}
                                     locationifExist={siteToShowDetails ? locations.find((item) => item.sitef_id === siteToShowDetails.id): null}
                                     setShowDetailModal={setShowDetailModal} />
                        </ModalWrapper>
                    )}
                    {isModalOpen && (
                        <ConfirmDeleteSite
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                            siteToDelete={siteToDelete}
                        />
                    )}
                    {showSitesDelete && (
                        <ConfirmSitesDelete
                            sitesToDelete={selectedSitesTodelete}
                            onConfirm={handleSitesDelete}
                            onCancel={() => setShowSitesDelete(false)}
                        />
                    )}
                </div>
            </div>
        </Authenticated>
    );
}

export default IndexSites;
