import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

function Details({ auth, site, siteDetails,surface,locationifExist, documents, setShowDetailModal }) {

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const Width = useWindowWidth();

    const typeLabels = {
        location: "Loué",
        propre: "Propriété",
    };

    return (
        <div className="max-w-6xl mx-auto px-2 py-1">

            <div className="bg-white rounded-lg shadow mb-6">
                <div className="bg-blue-600 rounded-t-lg p-4">
                    <h2 className="text-xl font-bold text-white">{siteDetails.name}</h2>
                </div>


                <div className="md:flex">
                    <div className="md:w-2/5 p-4">
                        <div className="rounded-lg overflow-hidden shadow bg-gray-100">
                            {siteDetails.image ? (
                                <img
                                    src={"/storage/" + siteDetails.image}
                                    alt={siteDetails.name}
                                    className={Width < 550 ? "w-full h-54 object-cover" : "w-full h-64 object-cover"}
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                    <span className="italic text-gray-400">Aucune image disponible</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:w-3/5 p-4">
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                <div>
                                    <p className="text-gray-500 text-sm">Adresse</p>
                                    <p className="font-medium">
                                        {siteDetails.address ? siteDetails.address : <span className="italic text-gray-400">Aucune adresse définie</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Site web</p>
                                    {siteDetails.web ? (
                                        <a
                                            href={siteDetails.web}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {siteDetails.web}
                                        </a>
                                    ) : (
                                        <span className="italic text-gray-400">Aucun site web défini</span>
                                    )}
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Téléphone</p>
                                    <p className="font-medium">
                                        {siteDetails.phone ? siteDetails.phone : <span className="italic text-gray-400">Aucun téléphone défini</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p className="font-medium">
                                        {siteDetails.email ? siteDetails.email : <span className="italic text-gray-400">Aucun email défini</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Coordonnées</p>
                                    <p className="font-medium">
                                        {siteDetails.latitude && siteDetails.longitude
                                            ? `${siteDetails.latitude}, ${siteDetails.longitude}`
                                            : <span className="italic text-gray-400">Aucune coordonnée définie</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Date d’ajout</p>
                                    <p className="font-medium">
                                        {siteDetails.created_at ? formatDate(siteDetails.created_at) : <span className="italic text-gray-400">Non définie</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Date de dernière mise à jour</p>
                                    <p className="font-medium">
                                        {siteDetails.updated_at ? formatDate(siteDetails.updated_at) : <span className="italic text-gray-400">Non définie</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Ville</p>
                                    <p className="font-medium">
                                        {siteDetails.ville ? siteDetails.ville : <span className="italic text-gray-400">Aucune ville définie</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Titre Foncier</p>
                                    <p className="font-medium">
                                        {siteDetails.titre_foncier ? siteDetails.titre_foncier : <span className="italic text-gray-400">Aucun titre foncier défini</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Superficie du terrain</p>
                                    <p className="font-medium">
                                        {siteDetails.superficie_terrain
                                            ? `${siteDetails.superficie_terrain} m²`
                                            : <span className="italic text-gray-400">Aucune superficie définie</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Zoning Urbanistique</p>
                                    <p className="font-medium">
                                        {siteDetails.zoning_urbanistique
                                            ? siteDetails.zoning_urbanistique
                                            : <span className="italic text-gray-400">Aucun zoning défini</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Consistance</p>
                                    <p className="font-medium">
                                        {siteDetails.consistance
                                            ? siteDetails.consistance
                                            : <span className="italic text-gray-400">Aucune consistance définie</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Surface GLA</p>
                                    <p className="font-medium">
                                        {siteDetails.surface_gla
                                            ? `${siteDetails.surface_gla} m²`
                                            : <span className="italic text-gray-400">Aucune surface GLA définie</span>}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Type de site</p>
                                    <p className="font-medium">
                                        {typeLabels[siteDetails.type_site]
                                            ? typeLabels[siteDetails.type_site]
                                            : <span className="italic text-gray-400">Aucun type de site défini</span>}
                                    </p>
                                </div>



                                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                    {surface && (
                                        <>
                                            <div className="col-span-full">
                                                <h3 className="text-lg font-semibold mb-2 text-gray-700">Surfaces détaillées</h3>
                                            </div>

                                            {/* TOTAL */}
                                            <div>
                                                <p className="text-gray-500 text-sm font-semibold">
                                                    Total : {surface.total ? surface.total + " m²" : <span className="italic text-gray-400">Aucun</span>}
                                                </p>
                                            </div>

                                            {/* VN */}
                                            <div className="pl-4">
                                                <p className="text-gray-500 text-sm font-semibold">
                                                    VN : {surface.vn ? surface.vn + " m²" : <span className="italic text-gray-400">Aucun</span>}
                                                </p>

                                                {/* Sous-niveaux SHOW ROOM */}
                                                <div className="pl-4">
                                                    <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                                        Show Room Dacia : <span className="font-medium">{surface.show_room_dacia ? surface.show_room_dacia + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                                    </p>

                                                    <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                                        Show Room Renault : <span className="font-medium">{surface.show_room_renault ? surface.show_room_renault + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                                    </p>

                                                    <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                                        Show Room Nouvelle Marque : <span className="font-medium">{surface.show_room_nouvelle_marque ? surface.show_room_nouvelle_marque + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                                    </p>

                                                    <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                                        Zone de préparation : <span className="font-medium">{surface.zone_de_preparation ? surface.zone_de_preparation + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* APV */}
                                            <div className="pl-4">
                                                <p className="text-gray-500 text-sm font-semibold">
                                                    APV : {surface.apv ? surface.apv + " m²" : <span className="italic text-gray-400">Aucun</span>}
                                                </p>

                                                {/* Sous-niveaux APV */}
                                                <div className="pl-4">
                                                    <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                                        RMS : <span className="font-medium">{surface.rms ? surface.rms + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                                    </p>

                                                    <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                                        Atelier mécanique : <span className="font-medium">{surface.atelier_mecanique ? surface.atelier_mecanique + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                                    </p>

                                                    <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                                        Atelier carrosserie : <span className="font-medium">{surface.atelier_carrosserie ? surface.atelier_carrosserie + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* VO */}
                                            <div className="pl-4">
                                                <p className="text-gray-500 text-sm font-semibold">
                                                    VO : {surface.vo ? surface.vo + " m²" : <span className="italic text-gray-400">Aucun</span>}
                                                </p>
                                            </div>

                                            {/* PARKING */}
                                            <div className="pl-4">
                                                <p className="text-gray-500 text-sm font-semibold">
                                                    Parking : {surface.parking ? surface.parking + " m²" : <span className="italic text-gray-400">Aucun</span>}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Informations sur la location (si présentes) */}
                                {locationifExist && (
                                    <>
                                        <div className="col-span-full">
                                            <h3 className="text-lg font-semibold mb-1 text-gray-700">Informations de location</h3>
                                        </div>

                                        <div className="col-span-full">
                                            {/* Exploitant */}
                                            <div className="py-2 border-gray-100">
                                                <p className="text-gray-500 text-sm">
                                                    <span className="font-semibold">Exploitant :</span>
                                                    <span className="ml-2">
                                                        {locationifExist.exploitant
                                                            ? locationifExist.exploitant
                                                            : <span className="italic text-gray-400">Aucun exploitant renseigné</span>}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Bailleur */}
                                            <div className="py-2 border-gray-100">
                                                <p className="text-gray-500 text-sm">
                                                    <span className="font-semibold">Bailleur :</span>
                                                    <span className="ml-2">
                                                        {locationifExist.bailleur
                                                            ? locationifExist.bailleur
                                                            : <span className="italic text-gray-400">Aucun bailleur renseigné</span>}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Date d'effet */}
                                            <div className="py-2 border-gray-100">
                                                <p className="text-gray-500 text-sm">
                                                    <span className="font-semibold">Date d'effet :</span>
                                                    <span className="ml-2">
                                                        {locationifExist.date_effet
                                                            ? new Date(locationifExist.date_effet).toLocaleDateString()
                                                            : <span className="italic text-gray-400">Aucune date d'effet renseignée</span>}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Durée du bail */}
                                            <div className="py-2 border-gray-100">
                                                <p className="text-gray-500 text-sm">
                                                    <span className="font-semibold">Durée du bail :</span>
                                                    <span className="ml-2">
                                                        {locationifExist.duree_bail
                                                            ? `${locationifExist.duree_bail} ans`
                                                            : <span className="italic text-gray-400">Aucune durée de bail renseignée</span>}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Loyer actuel */}
                                            <div className="py-2 border-gray-100">
                                                <p className="text-gray-500 text-sm">
                                                    <span className="font-semibold">Loyer actuel :</span>
                                                    <span className="ml-2">
                                                        {locationifExist.loyer_actuel
                                                            ? `${locationifExist.loyer_actuel} MAD`
                                                            : <span className="italic text-gray-400">Aucun loyer actuel renseigné</span>}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Taux de révision */}
                                            <div className="py-2 border-gray-100">
                                                <p className="text-gray-500 text-sm">
                                                    <span className="font-semibold">Taux de révision :</span>
                                                    <span className="ml-2">
                                                        {locationifExist.taux_revision
                                                            ? `${locationifExist.taux_revision} %`
                                                            : <span className="italic text-gray-400">Aucun taux de révision renseigné</span>}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Prochaine révision */}
                                            <div className="py-2 border-gray-100">
                                                <p className="text-gray-500 text-sm">
                                                    <span className="font-semibold">Prochaine révision :</span>
                                                    <span className="ml-2">
                                                        {locationifExist.prochaine_revision
                                                            ? new Date(locationifExist.prochaine_revision).toLocaleDateString()
                                                            : <span className="italic text-gray-400">Aucune prochaine révision renseignée</span>}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;
