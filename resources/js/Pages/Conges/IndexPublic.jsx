import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import toast from 'react-hot-toast';
import { TbPlayerTrackNextFilled, TbZoomReset } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { BiEdit } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import ModalWrapper from "@/Components/ModalWrapper";
import AddConges from "./AddConges";
import EditConges from "./EditConges";
import { MdOutlineCancel } from "react-icons/md";
import ConfirmCongeAnnuler from "@/Components/ConfirmCongeAnnuler";

export default function IndexPublic({ auth, conges,hasActiveContract, users, flash, employe }) {
    const { data, setData } = useForm({
        searchTerm: '',
        motif: '',
        status: '',
        start_date: '',
        end_date: ''
    });

    const width = useWindowWidth();
    const [showAddForm, setShowAddForm] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredConges, setFilteredConges] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [congeToEdit, setCongeToEdit] = useState(null);
    const [modalConge, setModalConge] = useState({ isOpen: false, conge: null, action: '' });
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [congeToDelete, setCongeToDelete] = useState(null);

    // Filtrer pour n'afficher que les congés de l'utilisateur connecté
    const myConges = employe ? conges.filter(conge => conge.user_id === auth.user.id) : [];

    const resetFilters = () => {
        setData({
            searchTerm: '',
            motif: '',
            status: '',
            start_date: '',
            end_date: ''
        });
        setCurrentPage(1);
    };

    const openCongeModal = (conge, action) => {
        setModalConge({ isOpen: true, conge, action });
    };

    const openDeleteConfirm = (conge) => {
        setCongeToDelete(conge);
        setShowConfirmDelete(true);
    };
    
    const handleConfirmDelete = () => {
        router.delete(route('conges.delete', { id: conge.id }), {
            onSuccess: () => {
                toast.success("Congé supprimé avec succès");
            },
            onError: () => {
                toast.error("Erreur lors de la suppression du congé");
            }
        });
        setShowModal(false);
    };

    const closeCongeModal = () => {
        setModalConge({ isOpen: false, conge: null, action: '' });
    };

    const confirmCongeAction = () => {
        if (!modalConge.conge) return;

        const url = modalConge.action === 'cancel' 
            ? route('conges.cancel', { id: modalConge.conge.id })
            : route('conges.delete', { id: modalConge.conge.id });

        router.post(url, {}, {
            onSuccess: () => {
                closeCongeModal();
                toast.success(modalConge.action === 'cancel' 
                    ? "Congé annulé avec succès" 
                    : "Congé supprimé avec succès");
            },
            onError: () => {
                toast.error("Une erreur est survenue");
            }
        });
    };

    // Filtrer les congés
    useEffect(() => {
        let filtered = [...myConges];

        if (data.searchTerm) {
            filtered = filtered.filter(conge => 
                conge.user?.name.toLowerCase().includes(data.searchTerm.toLowerCase())
            );
        }

        if (data.motif) {
            filtered = filtered.filter(conge => 
                conge.motif.toLowerCase().includes(data.motif.toLowerCase())
            );
        }

        if (data.status) {
            filtered = filtered.filter(conge => conge.status === data.status);
        }

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(conge => new Date(conge.date_debut) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            filtered = filtered.filter(conge => new Date(conge.date_fin) <= endDate);
        }

        setFilteredConges(filtered);
        setCurrentPage(1);
    }, [data.searchTerm, data.motif, data.status, data.start_date, data.end_date, myConges]);

    const openEditConge = (conge) => {
        setCongeToEdit(conge);
        setShowEditForm(true);
    };

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredConges.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredConges.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
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

    const itemsPerPageOptions = [5, 10, 20, 25, 50, 100];
    const totalConges = filteredConges.length;
    const availableOptions = itemsPerPageOptions.filter(option => option <= totalConges || option === itemsPerPageOptions[0]);

    useEffect(() => {
        setFilteredConges(myConges);
    }, [conges, employe]);

    useEffect(() => {
        if (flash?.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash?.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const hasPendingConge = myConges.some(conge => conge.status === 'en_attente');

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mes Demandes de Congés</h2>}>
            <Head title="Mes Demandes de Congés" />
            {/* Cas où l'utilisateur n'est pas encore enregistré comme employé */}
            {(!employe || !hasActiveContract) && (
                <div className="p-6">
                    <div className="mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="p-6">
                            <p className="text-gray-700">
                                {!employe 
                                    ? "Vous n'êtes pas encore enregistré comme employé dans le système pour pouvoir demander un congé."
                                    : "Vous n'avez pas de contrat actif pour le moument dans le système pour pouvoir demander un congé."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    {/* Cas où l'utilisateur est un employé */}
                    {(employe && hasActiveContract) && (
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="mr-1 text-lg font-medium text-gray-900">Liste de mes demandes de congés</h3>
                                {!hasPendingConge && (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Demander un nouveau congé"
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        <span className="flex justify-center items-center">
                                            <BsPlusCircle className="mr-2" />&nbsp; Nouvelle Demande
                                        </span>
                                    </button>
                                )}
                            </div>

                            {/* Filtres */}
                            <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
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

                            {/* Tableau des congés */}
                            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                <table className="border-collapse table-auto w-full whitespace-nowrap">
                                    <thead>
                                        <tr className="text-left bg-gray-50">
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
                                                                            onClick={() => openEditConge(conge)}
                                                                            title="Modifier le congé"
                                                                            className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                                        >
                                                                            <BiEdit />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => openDeleteConfirm(conge)}
                                                                            title="Annuler le congé"
                                                                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                                        >
                                                                            <MdOutlineCancel />
                                                                        </button>
                                                                    </>
                                                                )}
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
                    )}
                </div>
            </div>

            {/* Modals */}
            {showEditForm && congeToEdit && (
                <ModalWrapper
                    title={`Modifier ma demande de congé`}
                    onClose={() => setShowEditForm(false)}
                >
                    <EditConges
                        conge={congeToEdit}
                        setShowEdit={setShowEditForm}
                    />
                </ModalWrapper>
            )}

            {showAddForm && (
                <ModalWrapper 
                    title="Demander un nouveau congé" 
                    onClose={() => setShowAddForm(false)}
                >
                    <AddConges 
                        setShowAddForm={setShowAddForm} 
                        userId={auth.user.id}
                    />
                </ModalWrapper>
            )}

            {showConfirmDelete && congeToDelete && (
                <ConfirmCongeAnnuler
                    conge={congeToDelete}
                    onCancel={() => setShowConfirmDelete(false)}
                    onConfirm={() => {
                        router.delete(route('conges.delete', { id: congeToDelete.id }), {
                            onSuccess: () => {
                                setShowConfirmDelete(false);
                            },
                            onError: () => {
                                toast.error("Erreur lors de la suppression du congé");
                            }
                        });
                        setShowConfirmDelete(false);
                    }}
                />
            )}
        </Authenticated>
    );
}