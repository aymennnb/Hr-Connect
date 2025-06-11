import React,{useState } from 'react';
import { useForm } from '@inertiajs/react';
import {useWindowWidth} from "@/hooks/useWindowWidth.js";
import { Eye, EyeOff } from "lucide-react";

export default function EditUser({ auth, user, setShowEditForm }) {
    const { data, setData, post, processing, errors } = useForm({
        id: user.id,
        name: user.name,
        email: user.email,
        password:'',
        role: user.role,
    });

    const [showPassword, setShowPassword] = useState(false);

    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("utilisateurs.update"), {
            preserveScroll: true,
            onSuccess: () => {
                if (setShowEditForm) setShowEditForm(false);
            },
            onError: () => {
                console.error("Erreur lors de la mise à jour de l'utilisateur");
            }
        });
    };

    return (
        <>
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                        Nom
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
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                                className="w-full border rounded px-3 py-1"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="w-full border rounded px-3 py-1 pr-10"
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1.5 text-gray-600"
                                        >
                                        </button>
                                    </div>
                                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                        Rôle
                                    </label>
                                    <select
                                        id="role"
                                        className="w-full border rounded px-3 py-1"
                                        value={data.role}
                                        onChange={(e) => setData("role", e.target.value)}
                                    >
                                        {auth.user.role === "superadmin" && (
                                            <option value="admin">Admin</option>
                                        )}
                                        {(auth.user.role === "superadmin" || auth.user.role === "admin") && (
                                            <>
                                                <option value="manager">Responsable RH</option>
                                                <option value="user">Employé</option>
                                            </>
                                        )}
                                    </select>
                                    {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
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
                                        {processing ? "Enregistrement..." : "Mettre à jour l'utilisateur"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </>
    );
}
