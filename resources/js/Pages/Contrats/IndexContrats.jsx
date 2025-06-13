import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import toast from 'react-hot-toast';
import { TbPlayerTrackNextFilled, TbZoomReset } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { BiEdit } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import MultiSelectDropdown from "@/Components/MultiSelectDropdown";
import ModalWrapper from "@/Components/ModalWrapper";
import { MdOutlineDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { TiDocumentAdd } from "react-icons/ti";
import ConfirmContratAnnuler from "@/Components/ConfirmContratAnnuler";
import AddNewContract from "./AddNewContract";
import ContratDetailsModal from "./DetailsContrat";
import { CgDetailsMore } from "react-icons/cg";
import DetailsContrat from "./DetailsContrat";


export default function IndexContrats({ auth, contracts, departments, flash }) {
    const { data, setData, post } = useForm({
        searchTerm: '',
        type_contrat: '',
        status: '',
        start_date: '',
        end_date: '',
        department_id: ''
    });

    const width = useWindowWidth();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredContracts, setFilteredContracts] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contractToDelete, setContractToDelete] = useState(null);
    
    const [showAddContrat, setShowAddContrat] = useState(false);
    const [employeToAddNewContrat, setEmployeToAddNewContrat] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [contratToShowDetails, setContratToShowDetails] = useState(null); 

    const resetFilters = () => {
        setData({
            searchTerm: '',
            type_contrat: '',
            status: '',
            start_date: '',
            end_date: '',
            department_id: ''
        });
        setSelectedDepartments([]);
        setCurrentPage(1);
    };

    const handleDeleteClick = (contract) => {
        setContractToDelete(contract);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (contractToDelete) {
            router.delete(route('contrats.delete', { id: contractToDelete.id }));
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setContractToDelete(null);
    };

    // Fonction pour filtrer les contrats
    useEffect(() => {
        if (!contracts) return;

        let filtered = contracts.filter(contract => {
            const employee = contract.employe;
            const user = employee?.user;
            const department = employee?.departement;

            return (
                (!data.searchTerm || 
                 (user?.name && user.name.toLowerCase().includes(data.searchTerm.toLowerCase())) ||
                 (employee?.matricule && employee.matricule.toLowerCase().includes(data.searchTerm.toLowerCase()))) &&
                (!data.type_contrat || contract.type_contrat === data.type_contrat) &&
                (!data.status || getContractStatus(contract) === data.status) &&
                (!data.department_id || (department && department.id == data.department_id))
            );
        });

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(contract => new Date(contract.date_debut) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            filtered = filtered.filter(contract => new Date(contract.date_fin) <= endDate);
        }

        if (selectedDepartments.length > 0) {
            filtered = filtered.filter(contract => 
                selectedDepartments.includes(contract.employe?.departement_id)
            );
        }

        setFilteredContracts(filtered);
        setCurrentPage(1);
    }, [data.searchTerm, data.type_contrat, data.status, data.start_date, data.end_date, data.department_id, selectedDepartments, contracts]);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredContracts.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredContracts.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const getContractStatus = (contract) => {
        const now = new Date();
        const startDate = new Date(contract.date_debut);
        const endDate = contract.date_fin ? new Date(contract.date_fin) : null;

        if (now < startDate) return 'futur';
        if (endDate && now > endDate) return 'expire';
        return 'actif';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'actif':
                return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Actif</span>;
            case 'expire':
                return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Expiré</span>;
            case 'futur':
                return <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Futur</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Inconnu</span>;
        }
    };

    const getContractDuration = (contract) => {
        if (!contract.date_fin) return 'Indéterminé';
        
        const startDate = new Date(contract.date_debut);
        const endDate = new Date(contract.date_fin);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    };

    const itemsPerPageOptions = [5, 10, 20, 25, 50, 100, 150, 200, 300, 400, 600, 1000];
    const totalContracts = filteredContracts.length;
    const availableOptions = itemsPerPageOptions.filter(option => option <= totalContracts || option === itemsPerPageOptions[0]);

    // Initialiser filteredContracts avec contracts au chargement
    useEffect(() => {
        if (contracts) {
            setFilteredContracts(contracts);
        }
    }, [contracts]);

    useEffect(() => {
        if (flash?.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash?.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const employeHasActiveOrFutureContract = (employee) => {
        if (!employee || !contracts) return false;
        
        return contracts.some(c => {
            if (c.employe_id !== employee.id) return false;
            
            const now = new Date();
            const startDate = new Date(c.date_debut);
            const endDate = c.date_fin ? new Date(c.date_fin) : null;
            
            // Contrat futur
            if (now < startDate) return true;
            
            // Contrat actif (sans date de fin ou date de fin dans le futur)
            if (!endDate || now <= endDate) return true;
            
            return false;
        });
    };
    

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Contrats</h2>}>
            <Head title="Gestion des Contrats" />
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Liste des contrats</h3>
                        </div>

                        <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
                            {/* Filtre par employé ou matricule */}
                            <div className="relative flex-1 min-w-[200px]">
                                <label htmlFor="searchTerm" className="text-xs font-medium text-gray-700 mb-1 block">Recherche:</label>
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
                                        placeholder="Nom ou matricule..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par type de contrat */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="type_contrat" className="text-xs font-medium text-gray-700 mb-1 block">Type:</label>
                                <select
                                    id="type_contrat"
                                    name="type_contrat"
                                    value={data.type_contrat}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tous les types</option>
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="Stage">Stage</option>
                                    <option value="Alternance">Alternance</option>
                                    <option value="Interim">Intérim</option>
                                </select>
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
                                    <option value="actif">Actif</option>
                                    <option value="expire">Expiré</option>
                                    <option value="futur">Futur</option>
                                </select>
                            </div>

                            {/* Filtre par département */}
                            {departments && (
                                <div className="relative flex-1 min-w-[200px] z-20">
                                    <MultiSelectDropdown
                                        label="Départements :"
                                        options={departments}
                                        selectedOptions={selectedDepartments}
                                        setSelectedOptions={setSelectedDepartments}
                                    />
                                </div>
                            )}

                            {/* Dates de contrat */}
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
                                            Matricule
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employé
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Durée
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date début
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date fin
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Poste
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Département
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((contract) => {
                                            const employee = contract.employe;
                                            const user = employee?.user;
                                            const department = employee?.departement;
                                            const status = getContractStatus(contract);
                                            
                                            return (
                                                <tr key={contract.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {employee?.matricule || <span className="italic text-gray-400">N/A</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                        {user?.name || <span className="italic text-gray-400">Employé non trouvé</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {contract.type_contrat || <span className="italic text-gray-400">N/A</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {getStatusBadge(status)}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {getContractDuration(contract)}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {contract.date_debut ? new Date(contract.date_debut).toLocaleDateString('fr-FR') : <span className="italic text-gray-400">N/A</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {contract.date_fin ? new Date(contract.date_fin).toLocaleDateString('fr-FR') : <span className="italic text-gray-400">Indéterminé</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {employee?.poste || <span className="italic text-gray-400">N/A</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {department?.name || <span className="italic text-gray-400">N/A</span>}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex space-x-2 justify-center">
                                                            <button
                                                                onClick={() => {
                                                                    setShowDetailModal(true);
                                                                    setContratToShowDetails(contract);
                                                                }}
                                                                title={`Voir les détails du contrat`}
                                                                className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded bg-indigo-100"
                                                            >
                                                                <CgDetailsMore />
                                                            </button>
                                                            {/* Détermination des conditions */}
                                                            {status === 'expire' && !employeHasActiveOrFutureContract(contract.employe) && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEmployeToAddNewContrat(contract.employe);
                                                                        setShowAddContrat(true);
                                                                    }}
                                                                    className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                                    title="Ajouter un nouveau contrat"
                                                                >
                                                                    <TiDocumentAdd size={16} />
                                                                </button>
                                                            )}

                                                            {status === 'futur' && (
                                                                <button
                                                                    onClick={() => handleDeleteClick(contract)}
                                                                    className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                                    title="Supprimer le contrat"
                                                                >
                                                                    <RxCross2 />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <span className="italic text-gray-400">Aucun contrat trouvé</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredContracts.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredContracts.length} contrat(s) trouvé(s)
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
                                        Page {currentPage} sur {Math.ceil(filteredContracts.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredContracts.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredContracts.length / itemsPerPage)
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
                </div>
                {showDeleteModal && (
                    <ConfirmContratAnnuler
                        onCancel={cancelDelete}
                        onConfirm={confirmDelete}
                        contratsInfo={contractToDelete}
                    />
                )}

                {showDetailModal && (
                    <ModalWrapper 
                        title={`Détails du contrat ${contratToShowDetails?.employe?.user?.name ? 'de ' + contratToShowDetails.employe.user.name : ''}`}
                        onClose={() => {
                            setShowDetailModal(false);
                            setContratToShowDetails(null);
                        }}
                    >
                        {contratToShowDetails && (
                            <DetailsContrat
                                contrat={contratToShowDetails}
                                onClose={() => {
                                    setShowDetailModal(false);
                                    setContratToShowDetails(null);
                                }}
                            />
                        )}
                    </ModalWrapper>
                )}
                
                {showAddContrat && employeToAddNewContrat && (
                            <ModalWrapper 
                                title={`Ajouter un nouveau contrat pour ${employeToAddNewContrat.user.name}`}
                                onClose={() => {
                                    setShowAddContrat(false);
                                    setEmployeToAddNewContrat(null);
                                }}
                            >
                                <AddNewContract
                                    employe={employeToAddNewContrat}
                                    onClose={() => {
                                        setShowAddContrat(false);
                                        setEmployeToAddNewContrat(null);
                                    }}
                                    setShowAddContrat={setShowAddContrat}
                                />
                            </ModalWrapper>
                )}
            </div>
        </Authenticated>
    );
}