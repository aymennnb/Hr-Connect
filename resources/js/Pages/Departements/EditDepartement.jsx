import React from 'react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function EditDepartement({ departement, setShowEditForm }) {
    const { data, setData, post, processing, errors } = useForm({
        id: departement.id,
        name: departement.name,
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
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Nom du département
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="w-full border rounded px-3 py-1"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full border rounded px-3 py-1"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                rows={4}
                            />
                            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowEditForm(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 bg-yellow-100 text-yellow-600 rounded-md hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                    processing ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                            >
                                {processing ? "Enregistrement..." : "Mettre à jour le département"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
