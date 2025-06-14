import React from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function EditDepartement({ departement, setShowEditForm }) {
    const { data, setData, post, processing, errors } = useForm({
        id: departement.id,
        nom: departement.nom,
        description: departement.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("departements.update"), {
            preserveScroll: true,
            onSuccess: () => {
                if (setShowEditForm) setShowEditForm(false);
            },
            onError: () => {
                toast.error("Erreur lors de la mise à jour du département");
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Modifier le département</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom du département
                            </label>
                            <input
                                type="text"
                                value={data.nom}
                                onChange={(e) => setData("nom", e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                required
                            />
                            {errors.nom && (
                                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                rows="4"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowEditForm(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {processing ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
