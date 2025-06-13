import React from 'react';
import { MdOutlineDescription, MdPerson, MdWork, MdEvent, MdAccessTime, MdBusiness } from "react-icons/md";
import { FaFileSignature, FaRegCalendarAlt } from "react-icons/fa";

export default function DetailsContrat({ contrat, onClose }) {
    const employee = contrat?.employe;
    const user = employee?.user;
    const department = employee?.departement;

    const getStatusBadge = () => {
        const now = new Date();
        const startDate = new Date(contrat.date_debut);
        const endDate = contrat.date_fin ? new Date(contrat.date_fin) : null;

        let status = '';
        let badgeClass = '';

        if (now < startDate) {
            status = 'Futur';
            badgeClass = 'bg-blue-100 text-blue-800';
        } else if (endDate && now > endDate) {
            status = 'Expiré';
            badgeClass = 'bg-red-100 text-red-800';
        } else {
            status = 'Actif';
            badgeClass = 'bg-green-100 text-green-800';
        }

        return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${badgeClass}`}>{status}</span>;
    };

    const getContractDuration = () => {
        if (!contrat.date_fin) return 'Indéterminé';
        
        const startDate = new Date(contrat.date_debut);
        const endDate = new Date(contrat.date_fin);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    };

    return (
        <div className="space-y-6">
            {/* Grid principale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section Informations du Contrat */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                        Informations du Contrat
                    </h4>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium text-gray-600">Type:</span>
                            <span>{contrat.type_contrat || 'N/A'}</span>
                        </div>
                        
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium text-gray-600">Statut:</span>
                            {getStatusBadge()}
                        </div>
                        
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium text-gray-600">Durée:</span>
                            <span>{getContractDuration()}</span>
                        </div>
                        
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium text-gray-600">Date début:</span>
                            <span>
                                {contrat.date_debut ? new Date(contrat.date_debut).toLocaleDateString('fr-FR') : 'N/A'}
                            </span>
                        </div>
                        
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium text-gray-600">Date fin:</span>
                            <span>
                                {contrat.date_fin ? new Date(contrat.date_fin).toLocaleDateString('fr-FR') : 'Indéterminé'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Section Document du contrat */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                        Document du contrat
                    </h4>
                    
                    {contrat.document_path ? (
                        <div className="bg-white rounded border border-gray-200">
                            {contrat.document_path.match(/\.(pdf)$/i) ? (
                                <iframe
                                    src={`/storage/${contrat.document_path}`}
                                    width="100%"
                                    height="400px"
                                    title="Aperçu PDF"
                                    className="rounded"
                                />
                            ) : contrat.document_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <div className="flex justify-center p-2">
                                    <img
                                        src={`/storage/${contrat.document_path}`}
                                        alt="Document du contrat"
                                        className="max-h-80 object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-gray-600">
                                        <span className="italic text-gray-400">
                                            Aperçu non disponible
                                        </span>
                                    </p>
                                    <a
                                        href={`/storage/${contrat.document_path}`}
                                        className="mt-3 inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Télécharger le fichier
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded border border-gray-200 p-8 text-center">
                            <span className="italic text-gray-400">
                                Aucun document disponible
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}