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
import AddSalaire from "./AddSalaire";
import { MdOutlineCancel, MdOutlineDelete } from "react-icons/md";
import ConfirmDelete from "@/Components/ConfirmDelete";

export default function IndexSalaires({ auth, salaires, employes, flash }) {
    const { data, setData } = useForm({
        searchTerm: '',
        employe_id: '',
        month: '',
        year: ''
    });

    const width = useWindowWidth();
    const [showAddForm, setShowAddForm] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredSalaires, setFilteredSalaires] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [salaireToEdit, setSalaireToEdit] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [salaireToDelete, setSalaireToDelete] = useState(null);

    const resetFilters = () => {
        setData({
            searchTerm: '',
            employe_id: '',
            month: '',
            year: ''
        });
        setCurrentPage(1);
    };

    // Filtrer les salaires
    useEffect(() => {
        let filtered = [...salaires];

        if (data.searchTerm) {
            filtered = filtered.filter(salaire => 
                salaire.employe?.user?.name.toLowerCase().includes(data.searchTerm.toLowerCase())
            );
        }

        if (data.employe_id) {
            filtered = filtered.filter(salaire => salaire.employe_id == data.employe_id);
        }

        if (data.month) {
            filtered = filtered.filter(salaire => {
                const mois = new Date(salaire.mois);
                return mois.getMonth() + 1 == data.month;
            });
        }

        if (data.year) {
            filtered = filtered.filter(salaire => {
                const mois = new Date(salaire.mois);
                return mois.getFullYear() == data.year;
            });
        }

        setFilteredSalaires(filtered);
        setCurrentPage(1);
    }, [data.searchTerm, data.employe_id, data.month, data.year, salaires]);

    const openEditSalaire = (salaire) => {
        setSalaireToEdit(salaire);
        setShowEditForm(true);
    };

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSalaires.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredSalaires.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const itemsPerPageOptions = [5, 10, 20, 25, 50, 100];
    const totalSalaires = filteredSalaires.length;
    const availableOptions = itemsPerPageOptions.filter(option => option <= totalSalaires || option === itemsPerPageOptions[0]);

    useEffect(() => {
        setFilteredSalaires(salaires);
    }, [salaires]);

    useEffect(() => {
        if (flash?.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash?.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    // Générer les options pour les mois et années
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('fr-FR', { month: 'long' })
    }));

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
        <Authenticated 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Salaires</h2>}
        >
            <Head title="Gestion des Salaires" />
            
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Liste des salaires</h3>
                            <button
                                onClick={() => setShowAddForm(true)}
                                title="Ajouter un nouveau salaire"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                            >
                                <span className="flex justify-center items-center">
                                    <BsPlusCircle className="mr-2" />&nbsp; Nouveau Salaire
                                </span>
                            </button>
                        </div>

                        {/* Filtres */}
                        <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
                            {/* Filtre par recherche */}
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
                                        placeholder="Rechercher par employé..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par employé */}
                            <div className="flex-1 min-w-[200px]">
                                <label htmlFor="employe_id" className="text-xs font-medium text-gray-700 mb-1 block">Employé:</label>
                                <select
                                    id="employe_id"
                                    name="employe_id"
                                    value={data.employe_id}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tous les employés</option>
                                    {employes.map(employe => (
                                        <option key={employe.id} value={employe.id}>
                                            {employe.user?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtre par mois */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="month" className="text-xs font-medium text-gray-700 mb-1 block">Mois:</label>
                                <select
                                    id="month"
                                    name="month"
                                    value={data.month}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tous les mois</option>
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtre par année */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="year" className="text-xs font-medium text-gray-700 mb-1 block">Année:</label>
                                <select
                                    id="year"
                                    name="year"
                                    value={data.year}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Toutes les années</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
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

                        {/* Tableau des salaires */}
                        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                            <table className="border-collapse table-auto w-full whitespace-nowrap">
                                <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employé
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mois
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salaire de base
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prime
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Heures supplémentaires
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Retenues
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salaire net
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date de traitement
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((salaire) => (
                                            <tr key={salaire.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {salaire.employe?.user?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(salaire.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {salaire.salaire_base.toLocaleString('fr-FR')} MAD
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {salaire.prime.toLocaleString('fr-FR')} MAD
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {salaire.heures_sup} h
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {salaire.retenue.toLocaleString('fr-FR')} MAD
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {salaire.salaire_net.toLocaleString('fr-FR')} MAD
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(salaire.date_traitement).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2 justify-center">
                                                        <button
                                                            onClick={() => {
                                                                setSalaireToDelete(salaire);
                                                                setShowConfirmDelete(true);
                                                            }}
                                                            title="Annuler l’effectuation du paiement"
                                                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                        >
                                                            <MdOutlineCancel />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <span className="italic text-gray-400">Aucun salaire trouvé</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredSalaires.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredSalaires.length} salaire(s) trouvé(s)
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
                                        Page {currentPage} sur {Math.ceil(filteredSalaires.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredSalaires.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredSalaires.length / itemsPerPage)
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
            </div>

            {/* Modals */}
            {showAddForm && (
                <ModalWrapper 
                    title="Ajouter un nouveau salaire" 
                    onClose={() => setShowAddForm(false)}
                >
                    <AddSalaire 
                        setShowAddForm={setShowAddForm} 
                        employes={employes}
                        salaires={salaires}
                    />
                </ModalWrapper>
            )}

            {showConfirmDelete && salaireToDelete && (
                <ConfirmDelete
                    item={salaireToDelete}
                    onCancel={() => setShowConfirmDelete(false)}
                    onConfirm={() => {
                        router.delete(route('salaires.delete', { id: salaireToDelete.id }), 
                        setShowConfirmDelete(false)
                    );
                    }}
                    message={`Êtes-vous sûr de vouloir annuler l’effectuation du paiement de ${salaireToDelete.employe?.user?.name} pour le mois de ${new Date(salaireToDelete.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} ?`}
                />
            )}
        </Authenticated>
    );
}