import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

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
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    duration: 0.8
                }}
                className="w-full h-[95vh] flex items-center justify-center p-8"
            >
                <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                    <Head title="Mot de passe oublié - HR-Connect" />

                    <div className="mb-6 text-center">
                        <div className="text-2xl font-bold mb-2">
                            <span style={{ color: colors.primary }}>HR</span>
                            <span style={{ color: colors.accent }}>-Connect</span>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            Mot de passe oublié ?
                        </h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Indiquez votre email pour recevoir un lien de réinitialisation
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
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
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {processing ? "Envoi en cours..." : "Envoyer le lien"}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-sm">
                                Retour à{" "}
                                <Link
                                    href={route("login")}
                                    className="font-medium"
                                    style={{ color: colors.primary }}
                                >
                                    Connexion
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}