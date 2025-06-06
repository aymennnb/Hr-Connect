import React from "react";
import { useForm } from "@inertiajs/react";
import {useWindowWidth} from "@/hooks/useWindowWidth.js";

export default function AddUser({ auth, setShowAddForm }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "12345678",
        role: "user",
    });

    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("user.create"),{
            onSuccess:()=>{
                setShowAddForm(false);
            }
        });
    };

    return (
        <>
            <div>
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-medium mb-4">Fournir les informations suivantes</h3>
                                <div className="h-96 overflow-y-auto p-2">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                                Nom
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                className="w-full border rounded px-3 py-1"                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                placeholder="Entrez le nom de l'utilisateur"
                                            />
                                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="w-full border rounded px-3 py-1"                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                placeholder="Entrez l'email de l'utilisateur"
                                            />
                                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                                Mot de passe
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                className="w-full border rounded px-3 py-1"                                                value={data.password}
                                                onChange={(e) => setData("password", e.target.value)}
                                                placeholder="Entrez le mot de passe"
                                            />
                                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                                Rôle
                                            </label>
                                            <select
                                                id="role"
                                                className="w-full border rounded px-3 py-1"                                                value={data.role}
                                                onChange={(e) => setData("role", e.target.value)}
                                            >
                                                {auth.user.role === "superadmin" && (
                                                    <>
                                                        <option value="admin">Admin</option>
                                                        <option value="manager">Responsable RH</option>
                                                        <option value="user">Employé</option>
                                                    </>
                                                )}

                                                {auth.user.role === "admin" && (
                                                    <>
                                                        <option value="manager">Responsable RH</option>
                                                        <option value="user">Employés</option>
                                                    </>
                                                )}
                                            </select>
                                            {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
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
                                                {processing ? "Enregistrement..." : "Ajouter l'utilisateur"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}
