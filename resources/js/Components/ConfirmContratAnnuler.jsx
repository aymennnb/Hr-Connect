import React from "react";

export default function ConfirmContratAnnuler({ onCancel, onConfirm,contratsInfo }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">
                    Confirmer l'annulation
                </h2>
                <p className="mb-6">
                    Êtes-vous sûr de vouloir annuler ce contrat {contratsInfo?.employe?.user?.name && "de " + contratsInfo?.employe?.user?.name }?
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
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}
