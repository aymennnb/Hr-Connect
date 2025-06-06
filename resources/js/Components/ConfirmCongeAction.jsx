import React from 'react';
import { MdOutlineDone } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

export default function ConfirmCongeAction({ conge, action, onConfirm, onCancel }) {
    const isAccept = action === 'accept';
    const label = isAccept ? 'accepter' : 'refuser';
    const Icon = isAccept ? MdOutlineDone : RxCross2;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">
                    {action === 'accept'
                        ? 'Confirmer l’acceptation du congé'
                        : 'Confirmer le refus du congé'}
                </h2>
                <p className="mb-6">
                    Voulez-vous vraiment {label} le congé de{' '}{conge.user?.name || <span className="italic text-gray-500">cet employé</span>} ?
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded text-white flex items-center gap-1 ${
                            isAccept ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                    </button>
                </div>
            </div>
        </div>
    );
}