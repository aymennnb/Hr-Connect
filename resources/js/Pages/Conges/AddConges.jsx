import React from 'react';
import { useForm } from '@inertiajs/react';

function AddConges({ auth, setShowAddForm }) {
    const { data, setData, post, processing, errors } = useForm({
        motif: '',
        date_debut: '',
        date_fin: '',
        commentaire: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('conges.create'), {
            onSuccess: () => {
                setShowAddForm(false);
            }
        });
    };

    const today = new Date().toISOString().split('T')[0];
    
    return (
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Demande de congé</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motif">
                                Motif
                            </label>
                            <input
                                id="motif"
                                type="text"
                                className="w-full border rounded px-3 py-1"
                                value={data.motif}
                                onChange={(e) => setData("motif", e.target.value)}
                                placeholder="Motif du congé"
                            />
                            {errors.motif && <p className="mt-2 text-sm text-red-600">{errors.motif}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_debut">
                                Date de début
                            </label>
                            <input
                                id="date_debut"
                                type="date"
                                min={today}
                                className="w-full border rounded px-3 py-1"
                                value={data.date_debut}
                                onChange={(e) => setData("date_debut", e.target.value)}
                            />
                            {errors.date_debut && <p className="mt-2 text-sm text-red-600">{errors.date_debut}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_fin">
                                Date de fin
                            </label>
                            <input
                                id="date_fin"
                                type="date"
                                className="w-full border rounded px-3 py-1"
                                value={data.date_fin}
                                onChange={(e) => setData("date_fin", e.target.value)}
                            />
                            {errors.date_fin && <p className="mt-2 text-sm text-red-600">{errors.date_fin}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="commentaire">
                                Commentaire (optionnel)
                            </label>
                            <textarea
                                id="commentaire"
                                className="w-full border rounded px-3 py-1"
                                value={data.commentaire}
                                onChange={(e) => setData("commentaire", e.target.value)}
                                placeholder="Commentaire supplémentaire"
                                rows="3"
                            />
                            {errors.commentaire && <p className="mt-2 text-sm text-red-600">{errors.commentaire}</p>}
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                                    processing ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                            >
                                {processing ? "Envoi en cours..." : "Soumettre la demande"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddConges;