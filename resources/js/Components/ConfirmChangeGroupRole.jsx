import React from 'react';
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

const ConfirmChangeGroupRole = ({ usersToChange, newRole, onConfirm, onCancel }) => {
    const windowWidth = useWindowWidth();

    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        onCancel();
    };

    const getRoleLabel = (role) => {
        if (role === 'admin') return 'admin';
        if (role === 'manager') return 'responsable RH';
        return 'employés';
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`
                    bg-white p-6 rounded-lg shadow-lg max-w-md
                    ${windowWidth < 530
                    ? 'w-[90%] max-w-xs'
                    : 'w-full'
                }
                `}
            >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Confirmer le Changement de Rôle
                </h2>
                <p className="text-gray-600 mb-6">
                    Voulez-vous vraiment changer le rôle des utilisateurs suivants en {getRoleLabel(newRole)} ?
                </p>
                <ul className="text-sm text-gray-700 mb-6 list-disc list-inside max-h-40 overflow-y-auto">
                    {usersToChange.map((user, index) => (
                        <li key={index}>{user.name ?? `Utilisateur ID: ${user.id}`}</li>
                    ))}
                </ul>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmChangeGroupRole;
