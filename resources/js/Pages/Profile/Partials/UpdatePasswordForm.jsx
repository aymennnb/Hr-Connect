import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Mettre à jour le mot de passe
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester sécurisé.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div className="relative">
                    <InputLabel htmlFor="current_password" value="Mot de passe actuel" />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type={showCurrentPassword ? "text" : "password"}
                        className="mt-1 block w-full pr-10"
                        autoComplete="current-password"
                    />
                    <div
                        className="absolute right-3 top-9 cursor-pointer text-gray-500"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div className="relative">
                    <InputLabel htmlFor="password" value="Nouveau mot de passe" />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type={showNewPassword ? "text" : "password"}
                        className="mt-1 block w-full pr-10"
                        autoComplete="new-password"
                    />
                    <div
                        className="absolute right-3 top-9 cursor-pointer text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="relative">
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type={showConfirmPassword ? "text" : "password"}
                        className="mt-1 block w-full pr-10"
                        autoComplete="new-password"
                    />
                    <div
                        className="absolute right-3 top-9 cursor-pointer text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#10b981] hover:bg-[#16735c] text-white font-medium py-2 px-4 text-sm rounded-md transition duration-300 ease-in-out"
                    >
                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Modifications enregistrées.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
