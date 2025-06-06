import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={`w-full max-w-md ${className}`}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Informations du profil
                </h1>
                <p className="text-sm text-gray-600">
                    Modifiez le nom et l'adresse e-mail associés à votre compte.
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                        Nom complet
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-1 text-xs" />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                        Adresse e-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1 text-xs" />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mb-4 text-sm text-gray-800">
                        Votre adresse e-mail n'est pas vérifiée.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="ml-1 text-[#ff6c04] hover:text-[#5a217b] underline"
                        >
                            Renvoyer l'e-mail de vérification
                        </Link>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Un nouveau lien de vérification a été envoyé.
                            </div>
                        )}
                    </div>
                )}

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
