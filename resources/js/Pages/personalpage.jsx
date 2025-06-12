import Authenticated from "@/Layouts/AuthenticatedLayout";
import { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function PersonalPage({ auth, flash, employe, contrats }) {
    useEffect(() => {
        if (flash.message?.success) toast.success(flash.message.success);
        if (flash.message?.error) toast.error(flash.message.error);
    }, [flash]);

    // Fonction pour formater les dates en français
    const formatDate = (dateString) => {
        if (!dateString) return "Non spécifié";
        return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    };

    // Trouver le contrat actuel (le plus récent)
    const currentContrat = contrats?.length > 0 ? contrats[0] : null;

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Espace Personnel
                </h2>
            }
        >
            <Head title="Espace Personnel" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Cas où l'utilisateur n'est pas encore enregistré comme employé */}
                    {!employe && (
                        <div className="mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
                            <div className="p-6">
                                <p className="text-gray-700">
                                    Vous n'êtes pas encore enregistré comme
                                    employé dans le système, Veuillez contacter
                                    votre administrateur pour plus
                                    d'informations.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Cas où l'utilisateur est un employé */}
                    {employe && (
                        <>
                            {/* Carte Informations Personnelles avec photo */}
                            <div className="mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Vos Informations
                                    </h3>
                                </div>
                                <div className="p-6 border-t border-gray-200">
                                    <div className="flex  items-center flex-col lg:flex-row gap-8">
                                        {/* Photo de profil - Partie gauche */}
                                        <div className="lg:w-1/3 flex justify-center lg:justify-start">
                                            {employe.photo ? (
                                                <img
                                                    src={`/storage/${employe.photo}`}
                                                    alt={employe.user?.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <span className="italic text-gray-500 text-sm text-center">
                                                        Aucune photo
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Informations personnelles - Partie droite */}
                                        <div className="lg:w-2/3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Matricule
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {employe?.matricule ||
                                                            "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        CIN
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {employe?.cin || "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Poste
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {employe?.poste || "-"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Date d'embauche
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {formatDate(
                                                            employe?.date_embauche
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Date de naissance
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {formatDate(
                                                            employe?.date_naissance
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Email
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {employe?.email || "-"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Téléphone
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {employe?.telephone ||
                                                            "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">
                                                        Adresse
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {employe?.adresse ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Carte Contrat Actuel avec document */}
                            <div className="mb-6 overflow-hidden bg-white shadow sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Contrat Actuel
                                    </h3>
                                </div>
                                <div className="p-6 border-t border-gray-200">
                                    {currentContrat ? (
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Informations du contrat - Partie gauche */}
                                            <div className="lg:w-1/2">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">
                                                            Type de contrat
                                                        </h4>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {
                                                                currentContrat.type_contrat
                                                            }
                                                        </p>
                                                    </div>
                                                    <br />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">
                                                            Titre du poste
                                                        </h4>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {
                                                                currentContrat.titre
                                                            }
                                                        </p>
                                                    </div>
                                                    <br />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">
                                                            Date de début
                                                        </h4>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {formatDate(
                                                                currentContrat.date_debut
                                                            )}
                                                        </p>
                                                    </div>
                                                    <br />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-500">
                                                            Date de fin
                                                        </h4>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {currentContrat.date_fin
                                                                ? formatDate(
                                                                      currentContrat.date_fin
                                                                  )
                                                                : "il n'a pas de date de fin prévue"}
                                                        </p>
                                                    </div>
                                                    <br />
                                                    <div className="md:col-span-2">
                                                        <h4 className="text-sm font-medium text-gray-500">
                                                            {currentContrat.mode_paiement ===
                                                                "mensuel" &&
                                                                "Salaire mensuel"}
                                                            {currentContrat.mode_paiement ===
                                                                "horaire" &&
                                                                "Salaire horaire"}
                                                            {currentContrat.mode_paiement ===
                                                                "forfaitaire" &&
                                                                "Montant forfaitaire"}
                                                        </h4>
                                                        <p className="mt-1 text-sm text-gray-900">
                                                            {
                                                                currentContrat.salaire_mensuel
                                                            }{" "}
                                                            MAD
                                                            {currentContrat.mode_paiement ===
                                                                "horaire" &&
                                                                " / heure"}
                                                        </p>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <h4 className="text-sm font-medium text-gray-500">
                                                            Mode de paiement
                                                        </h4>
                                                        <p className="mt-1 text-sm text-gray-900 capitalize">
                                                            {
                                                                currentContrat.mode_paiement
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Document du contrat - Partie droite */}
                                            <div className="lg:w-1/2">
                                                <h4 className="text-sm font-medium text-gray-500 mb-4">
                                                    Document du contrat
                                                </h4>
                                                {currentContrat.document_path ? (
                                                    <div className="bg-gray-50 rounded border border-gray-200">
                                                        {currentContrat.document_path.match(
                                                            /\.(pdf)$/i
                                                        ) ? (
                                                            <iframe
                                                                src={`/storage/${currentContrat.document_path}`}
                                                                width="100%"
                                                                height="400px"
                                                                title="Aperçu PDF"
                                                                className="rounded"
                                                            />
                                                        ) : currentContrat.document_path.match(
                                                              /\.(jpg|jpeg|png)$/i
                                                          ) ? (
                                                            <div className="flex justify-center p-2">
                                                                <img
                                                                    src={`/storage/${currentContrat.document_path}`}
                                                                    alt="Aperçu image"
                                                                    className="max-h-80 object-contain"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="p-8 text-center">
                                                                <p className="text-gray-600">
                                                                    <span className="italic text-gray-400">
                                                                        Aperçu
                                                                        non
                                                                        disponible
                                                                    </span>
                                                                </p>
                                                                <a
                                                                    href={`/storage/${currentContrat.document_path}`}
                                                                    className="mt-3 inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded hover:text-blue-900"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Télécharger
                                                                    le fichier
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-50 rounded border border-gray-200 p-8 text-center">
                                                        <span className="italic text-gray-400">
                                                            Aucun document
                                                            disponible
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Aucun contrat actif trouvé
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Authenticated>
    );
}
