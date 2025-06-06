import React from "react";
import { useForm } from "@inertiajs/react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

export default function AddDepartement({ setShowAddForm }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        // uploaded_by: auth.user.id   
    });

    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("departement.create"), {
            onSuccess: () => {
                setShowAddForm(false);
            },
        });
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h3 className="text-lg font-medium mb-4">Ajouter un nouveau département</h3>
                        <div className="h-96 overflow-y-auto p-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="mb-6">
                                    <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
                                        Nom du département
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full border rounded px-3 py-1"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Entrez le nom du département"
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        className="w-full border rounded px-3 py-1"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Entrez une description du département"
                                        rows={3}
                                    />
                                    {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-6 py-2 bg-[#2563eb] text-white rounded-md hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 transition-colors ${
                                            processing ? "opacity-75 cursor-not-allowed" : ""
                                        }`}
                                    >
                                        {processing ? "Enregistrement..." : "Ajouter le département"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
