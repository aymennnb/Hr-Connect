import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function IndexSalaire({ auth, salaires, employes, filters }) {
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSalaire, setSelectedSalaire] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [month, setMonth] = useState(filters.month || '');
    const [year, setYear] = useState(filters.year || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        employe_id: '',
        mois: '',
        salaire_base: '',
        prime: '',
        heures_sup: '',
        retenue: '',
        salaire_net: '',
    });

    // Reset form when modal is closed
    useEffect(() => {
        if (!showForm) {
            reset();
            setSelectedSalaire(null);
        }
    }, [showForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedSalaire) {
            router.put(route('salaires.update', selectedSalaire.id), data, {
                onSuccess: () => {
                    toast.success('Salaire mis à jour avec succès');
                    setShowForm(false);
                    setSelectedSalaire(null);
                },
                onError: (errors) => {
                    Object.values(errors).forEach(error => toast.error(error));
                }
            });
        } else {
            router.post(route('salaires.store'), data, {
                onSuccess: () => {
                    toast.success('Salaire ajouté avec succès');
                    setShowForm(false);
                },
                onError: (errors) => {
                    Object.values(errors).forEach(error => toast.error(error));
                }
            });
        }
    };

    const handleEdit = (salaire) => {
        setSelectedSalaire(salaire);
        setData({
            employe_id: salaire.employe_id,
            mois: salaire.mois,
            salaire_base: salaire.salaire_base,
            prime: salaire.prime,
            heures_sup: salaire.heures_sup,
            retenue: salaire.retenue,
            salaire_net: salaire.salaire_net,
        });
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setSelectedSalaire({ id });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('salaires.delete', selectedSalaire.id), {
            onSuccess: () => {
                toast.success('Salaire supprimé avec succès');
                setShowDeleteModal(false);
                setSelectedSalaire(null);
            },
            onError: () => toast.error('Erreur lors de la suppression du salaire')
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const searchParams = {
            search: search || '',
            month: month ? parseInt(month) : '',
            year: year ? parseInt(year) : ''
        };
        
        router.get(route('salaires'), searchParams, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.salaires.length === 0) {
                    toast.error('Aucun résultat trouvé');
                } else {
                    toast.success(`${page.props.salaires.length} salaire(s) trouvé(s)`);
                }
            }
        });
    };

    const resetFilters = () => {
        setSearch('');
        setMonth('');
        setYear('');
        router.get(route('salaires'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestion des Salaires
                </h2>
            }
        >
            <Head title="Salaires" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Liste des Salaires
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedSalaire(null);
                                        reset();
                                        setShowForm(true);
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <FaPlus /> Nouveau Salaire
                                </button>
                            </div>

                            {/* Formulaire de recherche */}
                            <form onSubmit={handleSearch} className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rechercher un employé
                                        </label>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                            placeholder="Nom de l'employé..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mois
                                        </label>
                                        <select
                                            value={month}
                                            onChange={(e) => setMonth(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        >
                                            <option value="">Tous les mois</option>
                                            {Array.from({ length: 12 }, (_, i) => {
                                                const monthNum = i + 1;
                                                return (
                                                    <option key={monthNum} value={monthNum}>
                                                        {format(new Date(2000, i), 'MMMM', { locale: fr })}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Année
                                        </label>
                                        <select
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        >
                                            <option value="">Toutes les années</option>
                                            {Array.from({ length: 5 }, (_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div className="flex items-end space-x-2">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Rechercher
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Réinitialiser
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Table des salaires */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employé
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mois
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Salaire de base
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prime
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Heures supp.
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Retenue
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Salaire net
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {salaires.map((salaire) => (
                                            <tr key={salaire.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.employe.user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(salaire.mois), 'MMMM yyyy', { locale: fr })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.salaire_base.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.prime.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.heures_sup}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.retenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.salaire_net.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(salaire)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(salaire.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Modal de formulaire */}
                            {showForm && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                        <div className="mt-3">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                                {selectedSalaire ? 'Modifier le salaire' : 'Nouveau salaire'}
                                            </h3>
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Employé
                                                    </label>
                                                    <select
                                                        name="employe_id"
                                                        value={data.employe_id}
                                                        onChange={e => setData('employe_id', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        required
                                                    >
                                                        <option value="">Sélectionner un employé</option>
                                                        {employes.map((employe) => (
                                                            <option key={employe.id} value={employe.id}>
                                                                {employe.user.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.employe_id && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.employe_id}</p>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Mois
                                                    </label>
                                                    <input
                                                        type="month"
                                                        name="mois"
                                                        value={data.mois}
                                                        onChange={e => setData('mois', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        required
                                                    />
                                                    {errors.mois && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.mois}</p>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Salaire de base
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="salaire_base"
                                                        value={data.salaire_base}
                                                        onChange={e => setData('salaire_base', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        required
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                    {errors.salaire_base && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.salaire_base}</p>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Prime
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="prime"
                                                        value={data.prime}
                                                        onChange={e => setData('prime', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        required
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                    {errors.prime && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.prime}</p>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Heures supplémentaires
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="heures_sup"
                                                        value={data.heures_sup}
                                                        onChange={e => setData('heures_sup', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        required
                                                        min="0"
                                                    />
                                                    {errors.heures_sup && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.heures_sup}</p>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Retenue
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="retenue"
                                                        value={data.retenue}
                                                        onChange={e => setData('retenue', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        required
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                    {errors.retenue && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.retenue}</p>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Salaire net
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="salaire_net"
                                                        value={data.salaire_net}
                                                        onChange={e => setData('salaire_net', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                        required
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                    {errors.salaire_net && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.salaire_net}</p>
                                                    )}
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowForm(false)}
                                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                                    >
                                                        Annuler
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        {selectedSalaire ? 'Mettre à jour' : 'Ajouter'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modal de confirmation de suppression */}
                            {showDeleteModal && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                        <div className="mt-3">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                                Confirmer la suppression
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Êtes-vous sûr de vouloir supprimer ce salaire ? Cette action est irréversible.
                                            </p>
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setShowDeleteModal(false)}
                                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={confirmDelete}
                                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

export default IndexSalaire;