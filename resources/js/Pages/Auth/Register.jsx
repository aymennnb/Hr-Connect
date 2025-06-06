import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import { motion } from "framer-motion";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const width = useWindowWidth();
    const isMobile = width < 768;

    // Palette de couleurs HR-Connect
    const colors = {
        primary: '#2563eb',      // Bleu professionnel
        secondary: '#4f46e5',   // Indigo
        accent: '#10b981',      // Vert émeraude
        dark: '#1e293b',        // Bleu foncé
        light: '#f8fafc'        // Blanc cassé
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row relative bg-gray-50">
            {/* Partie formulaire */}
            <motion.div
                className="w-full h-[95vh] flex items-center justify-center p-8"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    duration: 0.8
                }}
            >
                <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                    <Head title="Inscription - HR-Connect" />

                    {/* En-tête */}
                    <div className="mb-6 text-center">
                        <div className="text-2xl font-bold">
                            <span style={{ color: colors.primary }}>HR</span>
                            <span style={{ color: colors.accent }}>-Connect</span>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800 mt-2">
                            Créer votre compte
                        </h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Rejoignez notre plateforme de gestion des ressources humaines
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        {/* Champ Nom */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                                Nom complet
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className={`w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[${colors.primary}] focus:border-[${colors.primary}] transition`}
                                autoComplete="name"
                                placeholder="Votre nom"
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-1 text-xs" />
                        </div>

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
                                autoComplete="email"
                                placeholder="votre@email.com"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1 text-xs" />
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
                                className={`w-full px-3 py-2 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[${colors.primary}] focus:border-[${colors.primary}] transition`}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password} className="mt-1 text-xs" />
                        </div>

                        {/* Confirmation mot de passe */}
                        <div className="mb-6 relative">
                            <label htmlFor="password_confirmation" className="block text-gray-700 text-sm font-medium mb-1">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                className={`w-full px-3 py-2 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[${colors.primary}] focus:border-[${colors.primary}] transition`}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                        </div>

                        {/* Bouton d'inscription */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {processing ? "Création du compte..." : "S'inscrire"}
                        </button>

                        {/* Lien de connexion */}
                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-sm">
                                Vous avez déjà un compte ?{" "}
                                <Link
                                    href={route("login")}
                                    className="font-medium"
                                    style={{ color: colors.primary }}
                                >
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}