import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import toast from 'react-hot-toast';
import { TbPlayerTrackNextFilled, TbZoomReset } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { TiDeleteOutline } from "react-icons/ti";
import { BiEdit } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import MultiSelectDropdown from "@/Components/MultiSelectDropdown";
import ConfirmDepartementsDelete from "@/Components/ConfirmDepartementsDelete";
import ConfirmDeleteDepartement from "@/Components/ConfirmDeleteDepartement";
import EditDepartement from "./EditDepartement";
import ModalWrapper from "@/Components/ModalWrapper";
import AddDepartement from "./AddDepartement";

export default function IndexDepartment({ auth, departements, users, flash }) {
    const { data, setData, post, delete: destroy } = useForm({
        departements_ids: [],
        searchTerm: '',
        description: '',
        start_date: '',
        end_date: '',
        uploaded_by: ''
    });

    const width = useWindowWidth();

    const [departementToDelete, setDepartementToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDepartementsDelete, setShowDepartementsDelete] = useState(false);

    const [showAddForm, setShowAddForm] = useState(false);

    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredDepartements, setFilteredDepartements] = useState([]);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [showEditForm, setShowEditForm] = useState(false);
    const [departementToEdit, setDepartementToEdit] = useState([]);

    const selectedDepartementsToDelete = departements.filter((dept) =>
        data.departements_ids.includes(dept.id)
    );

    const resetFilters = () => {
        setData({
            ...data,
            searchTerm: '',
            description: '',
            start_date: '',
            end_date: '',
            uploaded_by: ''
        });
        setSelectedUsers([]);
        setCurrentPage(1);
    };

    // Fonction pour filtrer les départements
    useEffect(() => {
        if (!departements) return;

        let filtered = departements.filter(dept =>
            (!data.searchTerm || (dept.name && dept.name.toLowerCase().includes(data.searchTerm.toLowerCase()))) &&
            (!data.description || (dept.description && dept.description.toLowerCase().includes(data.description.toLowerCase()))) &&
            (!data.uploaded_by || Number(dept.uploaded_by) === Number(data.uploaded_by))
        );

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(dept => new Date(dept.created_at) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(dept => new Date(dept.created_at) <= endDate);
        }

        if (selectedUsers.length > 0) {
            filtered = filtered.filter(dept => selectedUsers.includes(dept.uploaded_by));
        }

        setFilteredDepartements(filtered);
        setCurrentPage(1);
    }, [data.searchTerm, data.description, data.start_date, selectedUsers, data.end_date, data.uploaded_by, departements]);

    const openEditDepartemant = (departemant) => {
        setDepartementToEdit(departemant);
        setShowEditForm(departemant);
    };

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDepartements.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredDepartements.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectDepartement = (deptId) => {
        if (data.departements_ids.includes(deptId)) {
            setData("departements_ids", data.departements_ids.filter((id) => id !== deptId));
        } else {
            setData("departements_ids", [...data.departements_ids, deptId]);
        }
    };

    const handleDepartementsDelete = () => {
        if (data.departements_ids.length === 0) {
            toast.error("Veuillez sélectionner au moins un département.");
            return;
        }

        // Logique de suppression multiple - à adapter selon vos besoins
        post(route('departements.bulkDelete'), {
            onSuccess: () => {
                setData("departements_ids", []);
            },
            onError: () => {
                toast.error("Erreur lors de la suppression des départements.");
            }
        });

        setShowDepartementsDelete(false);
    };

    const handleDeleteClick = (departement) => {
        setDepartementToDelete(departement);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (!departementToDelete) return;
        destroy(route('departements.delete', departementToDelete.id));
        setIsModalOpen(false);
        setDepartementToDelete(null);
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
        setDepartementToDelete(null);
    };

    // Options pour le nombre d'éléments par page
    const itemsPerPageOptions = [5, 10, 20, 25, 50, 100, 150, 200, 300, 400, 600, 1000];
    const totalDepartements = filteredDepartements.length;
    const availableOptions = itemsPerPageOptions.filter(option => option <= totalDepartements || option === itemsPerPageOptions[0]);

    // Initialiser filteredDepartements avec departements au chargement
    useEffect(() => {
        if (departements) {
            setFilteredDepartements(departements);
        }
    }, [departements]);

    useEffect(() => {
        if (flash?.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash?.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const handleSelectAll = () => {
    const currentPageDeptIds = getCurrentPageItems().map(dept => dept.id);
    const allSelected = currentPageDeptIds.every(id => 
        data.departements_ids.includes(id)
    );

    if (allSelected) {
        // Désélectionner tous les départements de la page courante
        setData(
            "departements_ids", 
            data.departements_ids.filter(id => !currentPageDeptIds.includes(id))
        );
    } else {
        // Sélectionner tous les départements de la page courante
        const newSelectedIds = [...data.departements_ids];
        currentPageDeptIds.forEach(id => {
            if (!newSelectedIds.includes(id)) {
                newSelectedIds.push(id);
            }
        });
        setData("departements_ids", newSelectedIds);
    }
    };

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Départements</h2>}>
            <Head title="Départements" />
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Liste des départements</h3>
                            {width < 550 ?
                                <div className="flex space-x-3">
                                    {data.departements_ids.length > 0 && (
                                        <button
                                            onClick={() => setShowDepartementsDelete(true)}
                                            disabled={data.departements_ids.length === 0}
                                            title={`Supprimer ${data.departements_ids.length} département${data.departements_ids.length > 1 ? 's' : ''} sélectionné${data.departements_ids.length > 1 ? 's' : ''}`}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                        >
                                            <TiDeleteOutline />
                                        </button>
                                    )}
                                    <Link
                                        href={route('departements.add')}
                                        title="Ajouter un nouveau département"
                                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    >
                                        <BsPlusCircle />
                                    </Link>
                                </div> :
                                <div className="flex space-x-3">
                                    {data.departements_ids.length > 0 && (
                                        <button
                                            onClick={() => setShowDepartementsDelete(true)}
                                            disabled={data.departements_ids.length === 0}
                                            title={`Supprimer ${data.departements_ids.length} département${data.departements_ids.length > 1 ? 's' : ''} sélectionné${data.departements_ids.length > 1 ? 's' : ''}`}
                                            className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                        >
                                            <TiDeleteOutline />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Ajouter un nouveau département"
                                            className="px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        <span className="flex justify-center items-center"><BsPlusCircle />&nbsp; Nouveau Departement</span>
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
                                        placeholder="Nom du département..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par description */}
                            <div className="relative flex-1 min-w-[200px]">
                                <label htmlFor="description" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par description:</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={handleFilterChange}
                                        className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Description..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par personne qui a ajouté */}
                            {users && (
                                <div className="relative flex-1 min-w-[200px] z-20">
                                    <MultiSelectDropdown
                                        label="Créé par :"
                                        options={users}
                                        selectedOptions={selectedUsers}
                                        setSelectedOptions={setSelectedUsers}
                                    />
                                </div>
                            )}

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
                                            setCurrentPage(1);
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
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={
                                                    getCurrentPageItems().length > 0 &&
                                                    getCurrentPageItems().every(dept => 
                                                        data.departements_ids.includes(dept.id))
                                                }
                                            />
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Créé par
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date de création
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((departement) => (
                                            <tr key={departement.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.departements_ids.includes(departement.id)}
                                                        onChange={() => handleSelectDepartement(departement.id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {departement.nom}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {departement.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {departement.uploaded_by_user?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(departement.created_at).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => openEditDepartemant(departement)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        <BiEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(departement)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TiDeleteOutline />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <span className="italic text-gray-400">Aucun département trouvé.</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredDepartements.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredDepartements.length} département(s) trouvé(s)
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
                                        <FaBackward />
                                    </button>
                                    <span className="px-3 py-1 bg-gray-100 rounded-md">
                                        Page {currentPage} sur {Math.ceil(filteredDepartements.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredDepartements.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredDepartements.length / itemsPerPage)
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <TbPlayerTrackNextFilled />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {isModalOpen && departementToDelete && (
                        <ConfirmDeleteDepartement
                            departementToDelete={departementToDelete}
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                    )}

                    {showDepartementsDelete && (
                        <ConfirmDepartementsDelete
                            departementsToDelete={selectedDepartementsToDelete}
                            onConfirm={handleDepartementsDelete}
                            onCancel={() => setShowDepartementsDelete(false)}
                        />
                    )}

                    {showEditForm && departementToEdit && (
                        <ModalWrapper
                            title={`Modifier les informations du département ${departementToEdit.nom}`}
                            onClose={() => setShowEditForm(false)}
                        >
                            <EditDepartement
                                departement={departementToEdit}
                                setShowEditForm={setShowEditForm}
                                showEditForm={showEditForm}
                            />
                        </ModalWrapper>
                    )}

                    {showAddForm && (
                        <ModalWrapper title="Ajouter un nouveau département" onClose={() => setShowAddForm(false)}>
                            <AddDepartement setShowAddForm={setShowAddForm} />
                        </ModalWrapper>
                    )}

                </div>
            </div>
        </Authenticated>
    );
}