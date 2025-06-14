import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

function IndexSalaire({ auth, salaires, employes }) {
    const [showForm, setShowForm] = useState(false);
    const [selectedSalaire, setSelectedSalaire] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        employe_id: '',
        mois: '',
        salaire_base: '',
        prime: '',
        heures_sup: '',
        retenue: '',
        salaire_net: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedSalaire) {
            put(route('salaires.update', selectedSalaire.id), {
                onSuccess: () => {
                    toast.success('Salaire mis à jour avec succès');
                    setShowForm(false);
                    reset();
                },
                onError: () => toast.error('Erreur lors de la mise à jour du salaire'),
            });
        } else {
            post(route('salaires.store'), {
                onSuccess: () => {
                    toast.success('Salaire ajouté avec succès');
                    setShowForm(false);
                    reset();
                },
                onError: () => toast.error('Erreur lors de l\'ajout du salaire'),
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
        if (confirm('Êtes-vous sûr de vouloir supprimer ce salaire ?')) {
            axios.delete(route('salaires.delete', id))
                .then(() => {
                    toast.success('Salaire supprimé avec succès');
                })
                .catch(() => {
                    toast.error('Erreur lors de la suppression du salaire');
                });
        }
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

                            {showForm && (
                                <div className="mb-6 p-4 border rounded-lg">
                                    <h4 className="text-lg font-medium mb-4">
                                        {selectedSalaire ? 'Modifier le Salaire' : 'Nouveau Salaire'}
                                    </h4>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Employé
                                                </label>
                                                <select
                                                    value={data.employe_id}
                                                    onChange={(e) => setData('employe_id', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">Sélectionner un employé</option>
                                                    {employes.map((employe) => (
                                                        <option key={employe.id} value={employe.id}>
                                                            {employe.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.employe_id && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.employe_id}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Mois
                                                </label>
                                                <input
                                                    type="month"
                                                    value={data.mois}
                                                    onChange={(e) => setData('mois', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                {errors.mois && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.mois}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Salaire de Base
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.salaire_base}
                                                    onChange={(e) => setData('salaire_base', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                {errors.salaire_base && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.salaire_base}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Prime
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.prime}
                                                    onChange={(e) => setData('prime', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                {errors.prime && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.prime}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Heures Supplémentaires
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.heures_sup}
                                                    onChange={(e) => setData('heures_sup', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                {errors.heures_sup && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.heures_sup}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Retenues
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={data.retenue}
                                                    onChange={(e) => setData('retenue', e.target.value)}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                {errors.retenue && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.retenue}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowForm(false);
                                                    reset();
                                                }}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {processing ? 'Enregistrement...' : 'Enregistrer'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

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
                                                Salaire de Base
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prime
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Heures Sup
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Retenues
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Salaire Net
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
                                                    {salaire.employe.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(salaire.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.salaire_base.toLocaleString('fr-FR')} MAD
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.prime.toLocaleString('fr-FR')} MAD
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.heures_sup.toLocaleString('fr-FR')} h
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.retenue.toLocaleString('fr-FR')} MAD
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.salaire_net.toLocaleString('fr-FR')} MAD
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(salaire)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
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
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

export default IndexSalaire;