import React from 'react';
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

const ConfirmDepartementsDelete = ({ departementsToDelete, onConfirm, onCancel }) => {
    const windowWidth = useWindowWidth();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`
                    bg-white p-6 rounded-lg shadow-lg max-w-md
                    ${windowWidth < 530 ? 'w-[90%] max-w-xs' : 'w-full'}
                `}
            >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Confirmer la Suppression des Départements
                </h2>
                <p className="text-gray-600 mb-6">
                    Voulez-vous vraiment supprimer les départements suivants ?
                </p>
                <ul className="text-sm text-gray-700 mb-6 list-disc list-inside max-h-40 overflow-y-auto">
                    {departementsToDelete.map((dept, index) => (
                        <li key={index}>{dept.name ?? `Département ID: ${dept.id}`}</li>
                    ))}
                </ul>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDepartementsDelete;
