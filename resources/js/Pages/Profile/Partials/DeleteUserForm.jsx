import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

    export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Supprimer le compte
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Une fois votre compte supprimé, toutes ses ressources et données seront définitivement supprimées.
                    Avant de supprimer votre compte, veuillez télécharger toutes les données ou informations que vous souhaitez conserver.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Supprimer le compte
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 space-y-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Êtes-vous sûr de vouloir supprimer votre compte ?
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Une fois votre compte supprimé, toutes ses ressources et données seront définitivement supprimées.
                        Veuillez entrer votre mot de passe pour confirmer que vous souhaitez supprimer définitivement votre compte.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Mot de passe" className="sr-only" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full border rounded px-3 py-1"
                            placeholder="Mot de passe"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-75"
                            >
                                Supprimer le compte
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
