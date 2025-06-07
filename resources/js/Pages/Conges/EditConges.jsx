import React from "react";
import { useForm, usePage } from "@inertiajs/react";

function EditConges({ conge, setShowEdit }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        id: conge.id,
        motif: conge.motif || "",
        date_debut: conge.date_debut || "",
        date_fin: conge.date_fin || "",
        commentaire: conge.commentaire || "",
        user_id: conge.user_id || auth.user.id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("conges.update"), {
            preserveScroll: true,
            onSuccess: () => {
                setShowEdit(false);
            },
            onError: () => {
                console.error("Erreur lors de la mise à jour du congé");
            },
        });
    };

    const handleCancel = (e) => {
        e.preventDefault(); // Empêche la soumission du formulaire
        setShowEdit(false);
    };

    return (
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-medium mb-4">
                        Modifier la demande de congé
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-6">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="motif"
                            >
                                Motif
                            </label>
                            <input
                                id="motif"
                                type="text"
                                className="w-full border rounded px-3 py-1"
                                value={data.motif}
                                onChange={(e) =>
                                    setData("motif", e.target.value)
                                }
                                placeholder="Motif du congé"
                                required
                            />
                            {errors.motif && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.motif}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="date_debut"
                                >
                                    Date de début
                                </label>
                                <input
                                    id="date_debut"
                                    type="date"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.date_debut}
                                    onChange={(e) =>
                                        setData("date_debut", e.target.value)
                                    }
                                    required
                                />
                                {errors.date_debut && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.date_debut}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="date_fin"
                                >
                                    Date de fin
                                </label>
                                <input
                                    id="date_fin"
                                    type="date"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.date_fin}
                                    onChange={(e) =>
                                        setData("date_fin", e.target.value)
                                    }
                                    min={data.date_debut}
                                    required
                                />
                                {errors.date_fin && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.date_fin}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="commentaire"
                            >
                                Commentaire (optionnel)
                            </label>
                            <textarea
                                id="commentaire"
                                className="w-full border rounded px-3 py-1"
                                value={data.commentaire}
                                onChange={(e) =>
                                    setData("commentaire", e.target.value)
                                }
                                placeholder="Commentaire supplémentaire"
                                rows="3"
                            />
                            {errors.commentaire && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.commentaire}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-2 bg-yellow-100 text-yellow-600  rounded-md hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                                    processing
                                        ? "opacity-75 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {processing ? "Enregistrement..." : "Modifier le congé"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditConges;