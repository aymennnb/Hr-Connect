import React from 'react';
import { formatDate } from '@/utils/dateUtils';

function DetailsEmploye({ employe, onClose }) {
    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const birth = new Date(birthDate);
        if (isNaN(birth.getTime())) return null;
        
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    const etatCivilLabels = {
        celibataire: "Célibataire",
        marie: "Marié(e)",
        divorce: "Divorcé(e)",
        veuf: "Veuf/Veuve",
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo et informations de base */}
                <div className="col-span-1 flex flex-col items-center">
                    {employe.photo ? (
                        <img
                            src={`/storage/${employe.photo}`}
                            alt={employe.user?.name}
                            className="w-48 h-48 rounded-full object-cover mb-4"
                        />
                    ) : (
                        <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                            <span className="text-gray-500">Aucune photo</span>
                        </div>
                    )}
                    <h4 className="text-xl font-semibold">{employe.user?.name}</h4>
                    <p className="text-gray-600">Matricule: {employe.matricule || "N/A"}</p>
                </div>

                {/* Informations professionnelles */}
                <div className="col-span-1 space-y-4">
                    <h4 className="font-semibold text-gray-800 border-b pb-2">
                        Informations professionnelles
                    </h4>
                    <div>
                        <p className="text-sm text-gray-600">Poste:</p>
                        <p className="font-medium">{employe.poste || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Département:</p>
                        <p className="font-medium">
                            {employe.departement?.name || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Date d'embauche:</p>
                        <p className="font-medium">
                            {employe.date_embauche ? formatDate(employe.date_embauche) : "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Email:</p>
                        <p className="font-medium">{employe.user?.email || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Téléphone:</p>
                        <p className="font-medium">{employe.telephone || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">CIN:</p>
                        <p className="font-medium">{employe.cin || "N/A"}</p>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="col-span-1 space-y-4">
                    <h4 className="font-semibold text-gray-800 border-b pb-2">
                        Informations personnelles
                    </h4>
                    <div>
                        <p className="text-sm text-gray-600">Genre:</p>
                        <p className="font-medium">
                            {employe.genre === "M" ? "Homme" : "Femme"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Âge:</p>
                        <p className="font-medium">
                            {(() => {
                                const age = calculateAge(employe.date_naissance);
                                return age !== null ? `${age} ans` : "N/A";
                            })()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Date de naissance:</p>
                        <p className="font-medium">
                            {employe.date_naissance ? formatDate(employe.date_naissance) : "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">État civil:</p>
                        <p className="font-medium">
                            {employe.etat_civil ? 
                                etatCivilLabels[employe.etat_civil] || employe.etat_civil 
                                : "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Ville:</p>
                        <p className="font-medium">{employe.ville || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Adresse:</p>
                        <p className="font-medium">{employe.adresse || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsEmploye;