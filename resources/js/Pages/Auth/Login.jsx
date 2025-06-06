import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import { motion } from "framer-motion";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const width = useWindowWidth();
    const isMobile = width < 768;

    const [showPassword, setShowPassword] = useState(false);

    // Palette de couleurs HR-Connect
    const colors = {
        primary: '#2563eb',      // Bleu professionnel
        secondary: '#4f46e5',   // Indigo
        accent: '#10b981',      // Vert émeraude
        dark: '#1e293b',        // Bleu foncé
        light: '#f8fafc'        // Blanc cassé
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            <motion.div
                className="w-full h-[95vh] flex items-center justify-center p-8"
                initial={{ x: '100%', opacity: 0 }}  
                animate={{ x: 0, opacity: 1 }}     
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    duration: 0.8
                }}
            >
                <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                    <Head title="Connexion - HR-Connect" />
                    
                    {/* En-tête avec logo */}
                    <div className="mb-6 flex flex-col items-center">
                        <div className="text-2xl font-bold mb-2">
                            <span style={{ color: colors.primary }}>HR</span>
                            <span style={{ color: colors.accent }}>-Connect</span>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            Connexion à votre espace
                        </h1>
                    </div>

                    {status && (
                        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        {/* Champ Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[${colors.primary}] focus:border-[${colors.primary}] transition`}
                                autoComplete="username"
                                placeholder="votre@email.com"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Champ Mot de passe */}
                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className={`w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[${colors.primary}] focus:border-[${colors.primary}] transition pr-10`}
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    className={`h-4 w-4 rounded border-gray-300 text-[${colors.primary}] focus:ring-[${colors.primary}]`}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm font-medium"
                                    style={{ color: colors.primary }}
                                >
                                    Mot de passe oublié?
                                </Link>
                            )}
                        </div>

                        {/* Bouton de connexion */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
                            style={{ 
                                backgroundColor: colors.primary,
                                hover: { backgroundColor: colors.secondary }
                            }}
                        >
                            {processing ? "Connexion en cours..." : "Se connecter"}
                        </button>

                        {/* Lien d'inscription */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Vous n'avez pas de compte ?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-medium"
                                    style={{ color: colors.primary }}
                                >
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}