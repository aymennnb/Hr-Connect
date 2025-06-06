import React from "react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

const ChangeRoleConfirm = ({ UserToChangeRole, confirmChangeRole, cancelChangeRole }) => {
    const windowWidth = useWindowWidth();

    const handleConfirm = () => {
        confirmChangeRole();
    };

    const handleCancel = () => {
        cancelChangeRole();
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
                    Confirmer le Changement du Rôle
                </h2>
                <p className="text-gray-600 mb-6">
                    Voulez-vous vraiment changer le rôle de {UserToChangeRole?.userName} de {" "}
                    {UserToChangeRole?.LastRole === "admin"
                        ? "l'admin"
                        : UserToChangeRole?.LastRole === "manager"
                            ? "responsable RH"
                            : "employé"} à {" "}
                    {UserToChangeRole?.newRole === "admin"
                        ? "l'admin"
                        : UserToChangeRole?.newRole === "manager"
                            ? "responsable RH"
                            : "employé"} ?
                </p>
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

export default ChangeRoleConfirm;
