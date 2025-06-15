import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useState } from "react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import { TbPlayerTrackNextFilled, TbZoomReset } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";

export default function IndexPublic({ auth, salaires, employe, hasActiveContract }) {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const width = useWindowWidth();

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const sortedSalaires = [...salaires].sort((a, b) => {
        return new Date(b.mois) - new Date(a.mois);
    });

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedSalaires.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(sortedSalaires.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    const itemsPerPageOptions = [5, 10, 20, 25, 50, 100];
    const totalSalaires = sortedSalaires.length;
    const availableOptions = itemsPerPageOptions.filter(option => option <= totalSalaires || option === itemsPerPageOptions[0]);

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Mes Salaires
                </h2>
            }
        >
            <Head title="Mes Salaires" />
            {(!employe || !hasActiveContract) ? (
                <div className="p-6">
                    <div className="mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="p-6">
                            <p className="text-gray-700">
                                {!employe 
                                    ? "Vous n'êtes pas encore enregistré comme employé dans le système pour consulter vos salaires."
                                    : "Vous n'avez pas de contrat actif pour le moment dans le système pour consulter vos salaires."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Historique de mes salaires</h3>
                        </div>

                        {/* Filtres et pagination */}
                        <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
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
                                </div>
                            </div>
                        </div>

                        {/* Tableau des salaires */}
                        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                            <table className="border-collapse table-auto w-full whitespace-nowrap">
                                <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mois
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salaire de Base
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prime
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Retenues
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Net à Payer
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((salaire) => (
                                            <tr key={salaire.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatDate(salaire.mois)}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {formatMoney(salaire.salaire_base)}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {formatMoney(salaire.prime)}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {formatMoney(salaire.retenue)}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-green-600">
                                                    {formatMoney(salaire.salaire_net)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <div className="text-center py-12">
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            vectorEffect="non-scaling-stroke"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                                        />
                                                    </svg>
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                                        Aucun salaire enregistré
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Votre historique de salaires apparaîtra ici une fois disponible
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {sortedSalaires.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {sortedSalaires.length} salaire(s) trouvé(s)
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
                                        Page {currentPage} sur {Math.ceil(sortedSalaires.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(sortedSalaires.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(sortedSalaires.length / itemsPerPage)
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
            </div> ) }
        </Authenticated>
    );
}