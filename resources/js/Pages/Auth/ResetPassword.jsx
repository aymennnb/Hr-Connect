import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Form */}
            <div className="w-full md:w-2/2  h-[95vh] flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <Head title="Reset Password" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Réinitialisation de mot de passe
                        </h1>
                        <p className="text-sm text-gray-600">
                            Veuillez créer un nouveau mot de passe pour votre compte <br/> M-AUTOMOTIV.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                autoComplete="username"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1 text-xs" />
                        </div>

                        <div className="mb-4 relative">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                                Nouveau mot de passe
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition pr-10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            <div
                                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                            <InputError message={errors.password} className="mt-1 text-xs" />
                        </div>

                        {/* Confirmation du mot de passe */}
                        <div className="mb-4 relative">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password_confirmation">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition pr-10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                            />
                            <div
                                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            >
                                {showPasswordConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#5a217b] hover:bg-[#381454] text-white font-medium py-2 px-3 text-sm rounded-md transition duration-300 ease-in-out"
                        >
                            {processing ? "Traitement..." : "Réinitialiser le mot de passe"}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-xs">
                                Vous vous souvenez de votre mot de passe ?{" "}
                                <a
                                    href={route("login")}
                                    className="text-[#ff6c04] hover:text-[#5a217b] font-medium"
                                >
                                    Connexion
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
