import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import toast from 'react-hot-toast';
import { TbPlayerTrackNextFilled, TbZoomReset } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { BiEdit } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import MultiSelectDropdown from "@/Components/MultiSelectDropdown";
import EditConges from "./EditConges";
import ModalWrapper from "@/Components/ModalWrapper";
import AddConges from "./AddConges";
import { MdOutlineDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import ConfirmCongeAction from "@/Components/ConfirmCongeAction";


export default function IndexConges({ auth, conges, users, flash }) {
    const { data, setData, post, put } = useForm({
        conges_ids: [],
        searchTerm: '',
        motif: '',
        status: '',
        start_date: '',
        end_date: '',
        user_id: ''
    });

    const width = useWindowWidth();

    const [showAddForm, setShowAddForm] = useState(false);

    // Pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredConges, setFilteredConges] = useState([]);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [showEditForm, setShowEditForm] = useState(false);
    const [congeToEdit, setCongeToEdit] = useState(null);

    const [modalConge, setModalConge] = useState({ isOpen: false, conge: null, action: '' });

    const resetFilters = () => {
        setData({
            ...data,
            searchTerm: '',
            motif: '',
            status: '',
            start_date: '',
            end_date: '',
            user_id: ''
        });
        setSelectedUsers([]);
        setCurrentPage(1);
    };

    const openCongeModal = (conge, action) => {
    setModalConge({ isOpen: true, conge, action });
    };

    const closeCongeModal = () => {
        setModalConge({ isOpen: false, conge: null, action: '' });
    };

    const confirmCongeAction = () => {
        if (!modalConge.conge) return;

        const url = modalConge.action === 'accept'
            ? route('conges.accept', { id: modalConge.conge.id })
            : route('conges.refuse', { id: modalConge.conge.id });

        router.post(url, {}, {
            onSuccess: closeCongeModal,
        });
    };


    // Fonction pour filtrer les congés
    useEffect(() => {
        if (!conges) return;

        let filtered = conges.filter(conge =>
            (!data.searchTerm || (conge.user?.name && conge.user.name.toLowerCase().includes(data.searchTerm.toLowerCase()))) &&
            (!data.motif || (conge.motif && conge.motif.toLowerCase().includes(data.motif.toLowerCase()))) &&
            (!data.status || conge.status === data.status) &&
            (!data.user_id || Number(conge.user_id) === Number(data.user_id))
        );

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(conge => new Date(conge.date_debut) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            filtered = filtered.filter(conge => new Date(conge.date_fin) <= endDate);
        }

        if (selectedUsers.length > 0) {
            filtered = filtered.filter(conge => selectedUsers.includes(conge.user_id));
        }

        setFilteredConges(filtered);
        setCurrentPage(1);
    }, [data.searchTerm, data.motif, data.status, data.start_date, selectedUsers, data.end_date, data.user_id, conges]);

    const openEditConge = (conge) => {
        setCongeToEdit(conge);
        setShowEditForm(true);
    };

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredConges.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredConges.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleAcceptConge = (conge) => {
        put(route('conges.accept', conge.id), {
            onSuccess: () => {
                toast.success("Congé accepté avec succès.");
            },
            onError: () => {
                toast.error("Erreur lors de l'acceptation du congé.");
            }
        });
    };

    const handleRefuseConge = (conge) => {
        put(route('conges.refuse', conge.id), {
            onSuccess: () => {
                toast.success("Congé refusé avec succès.");
            },
            onError: () => {
                toast.error("Erreur lors du refus du congé.");
            }
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'en_attente':
                return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">En attente</span>;
            case 'accepte':
                return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Accepté</span>;
            case 'refuse':
                return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Refusé</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Inconnu</span>;
        }
    };

    // Options pour le nombre d'éléments par page
    const itemsPerPageOptions = [5, 10, 20, 25, 50, 100, 150, 200, 300, 400, 600, 1000];
    const totalConges = filteredConges.length;
    const availableOptions = itemsPerPageOptions.filter(option => option <= totalConges || option === itemsPerPageOptions[0]);

    // Initialiser filteredConges avec conges au chargement
    useEffect(() => {
        if (conges) {
            setFilteredConges(conges);
        }
    }, [conges]);

    useEffect(() => {
        if (flash?.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash?.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Congés</h2>}>
            <Head title="Gestion des Congés" />
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Liste des demandes de congés</h3>
                            {/* {width < 550 ?
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Ajouter une nouvelle demande de congé"
                                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    >
                                        <BsPlusCircle />
                                    </button>
                                </div> :
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Ajouter une nouvelle demande de congé"
                                        className="px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        <span className="flex justify-center items-center"><BsPlusCircle />&nbsp; Nouvelle Demande</span>
                                    </button>
                                </div>
                            } */}
                        </div>

                        <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
                            {/* Filtre par employé */}
                            <div className="relative flex-1 min-w-[200px]">
                                <label htmlFor="searchTerm" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par employé:</label>
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
                                        placeholder="Nom de l'employé..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par motif */}
                            <div className="relative flex-1 min-w-[200px]">
                                <label htmlFor="motif" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par motif:</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        id="motif"
                                        name="motif"
                                        value={data.motif}
                                        onChange={handleFilterChange}
                                        className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Motif du congé..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par statut */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="status" className="text-xs font-medium text-gray-700 mb-1 block">Statut:</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="en_attente">En attente</option>
                                    <option value="accepte">Accepté</option>
                                    <option value="refuse">Refusé</option>
                                </select>
                            </div>

                            {/* Filtre par employé */}
                            {users && (
                                <div className="relative flex-1 min-w-[200px] z-20">
                                    <MultiSelectDropdown
                                        label="Employés :"
                                        options={users}
                                        selectedOptions={selectedUsers}
                                        setSelectedOptions={setSelectedUsers}
                                    />
                                </div>
                            )}

                            {/* Dates de congé */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1 block">Date début:</label>
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
                                <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1 block">Date fin:</label>
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
                                            Employé
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Motif
                                        </th>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            Statut
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                            Durée
                                        </td>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date de demande
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date début
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date fin
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((conge) => {
                                            const dateDebut = new Date(conge.date_debut);
                                            const dateFin = new Date(conge.date_fin);
                                            const duree = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
                                            
                                            return (
                                                <tr key={conge.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {conge.user?.name || <span className="italic text-gray-400">Employé non trouvé</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {conge.motif || <span className="italic text-gray-400">Aucun motif</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {getStatusBadge(conge.status)}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {duree} jour{duree > 1 ? 's' : ''}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {conge.created_at ? new Date(conge.created_at).toLocaleDateString('fr-FR') : <span className="italic text-gray-400">Date inconnue</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {conge.date_debut ? new Date(conge.date_debut).toLocaleDateString('fr-FR') : <span className="italic text-gray-400">Date inconnue</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {conge.date_fin ? new Date(conge.date_fin).toLocaleDateString('fr-FR') : <span className="italic text-gray-400">Date inconnue</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2 justify-center">
                                                            {conge.status === 'en_attente' && (
                                                                <>
                                                                  <button
                                                                      onClick={() => openCongeModal(conge, 'accept')}
                                                                      title={`Accepter le congé de ${conge.user?.name || 'cet employé'}`}
                                                                      className="text-green-600 hover:text-green-900 px-2 py-1 rounded bg-green-100"
                                                                  >
                                                                      <MdOutlineDone />
                                                                  </button>

                                                                  <button
                                                                      onClick={() => openCongeModal(conge, 'refuse')}
                                                                      title={`Refuser le congé de ${conge.user?.name || 'cet employé'}`}
                                                                      className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                                  >
                                                                      <RxCross2 />
                                                                  </button>
                                                                </>
                                                            )}
                                                            {/* <button
                                                                onClick={() => openEditConge(conge)}
                                                                title="Modifier le congé"
                                                                className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                            >
                                                                <BiEdit />
                                                            </button> */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <span className="italic text-gray-400">Aucune demande de congé trouvée.</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredConges.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredConges.length} demande(s) de congé trouvée(s)
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
                                        Page {currentPage} sur {Math.ceil(filteredConges.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredConges.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredConges.length / itemsPerPage)
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

                    {showEditForm && congeToEdit && (
                        <ModalWrapper
                            title={`Modifier la demande de congé de ${congeToEdit.user?.name}`}
                            onClose={() => setShowEditForm(false)}
                        >
                            <EditConges
                                conge={congeToEdit}
                                setShowEdit={setShowEditForm}
                                users={users}
                            />
                        </ModalWrapper>
                    )}

                    {showAddForm && (
                        <ModalWrapper title="Ajouter une nouvelle demande de congé" onClose={() => setShowAddForm(false)}>
                            <AddConges setShowAddForm={setShowAddForm} users={users} />
                        </ModalWrapper>
                    )}

                    {modalConge.isOpen && modalConge.conge && (
                        <ConfirmCongeAction
                            conge={modalConge.conge}
                            action={modalConge.action}
                            onConfirm={confirmCongeAction}
                            onCancel={closeCongeModal}
                        />
                    )}

                </div>
            </div>
        </Authenticated>
    );
}