import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, {useEffect} from "react";
import {useWindowWidth} from "@/hooks/useWindowWidth.js";

function EditSite({ auth, siteToEdit,surface,locationifExist, setShowEditModal }) {
    const { data, setData, processing, post, errors } = useForm({
        id: siteToEdit?.id,
        name: siteToEdit?.name,
        web: siteToEdit?.web,
        email: siteToEdit?.email,
        phone: siteToEdit?.phone,
        address: siteToEdit?.address,
        latitude: siteToEdit?.latitude,
        longitude: siteToEdit?.longitude,
        image: null,
        ville:siteToEdit?.ville,
        titre_foncier:siteToEdit?.titre_foncier,
        superficie_terrain:siteToEdit?.superficie_terrain,
        zoning_urbanistique:siteToEdit?.zoning_urbanistique,
        consistance:siteToEdit?.consistance,
        surface_gla:siteToEdit?.surface_gla,
        type_site:siteToEdit?.type_site,
        exploitant: locationifExist?.exploitant,
        bailleur: locationifExist?.bailleur,
        date_effet: locationifExist?.date_effet,
        duree_bail: locationifExist?.duree_bail,
        loyer_actuel: locationifExist?.loyer_actuel,
        taux_revision: locationifExist?.taux_revision,
        prochaine_revision: locationifExist?.prochaine_revision,
        total: surface?.total,
        vn: {
            total: surface?.vn,
            show_room_dacia: surface?.show_room_dacia,
            show_room_renault: surface?.show_room_renault,
            show_room_nouvelle_marque: surface?.show_room_nouvelle_marque,
            zone_de_preparation: surface?.zone_de_preparation,
        },
        apv: {
            total: surface?.apv,
            rms: surface?.rms,
            atelier_mecanique: surface?.atelier_mecanique,
            atelier_carrosserie: surface?.atelier_carrosserie,
        },
        vo: surface?.vo,
        parking: surface?.parking,
    });

    // Fonction à ajouter à votre composant pour calculer les totaux
    const calculateVNTotal = () => {
        const { vn } = data;
        let total = 0;

        if (vn.show_room_dacia) total += parseFloat(vn.show_room_dacia) || 0;
        if (vn.show_room_renault) total += parseFloat(vn.show_room_renault) || 0;
        if (vn.show_room_nouvelle_marque) total += parseFloat(vn.show_room_nouvelle_marque) || 0;
        if (vn.zone_de_preparation) total += parseFloat(vn.zone_de_preparation) || 0;

        return total;
    };

    const calculateAPVTotal = () => {
        const { apv } = data;
        let total = 0;

        if (apv.rms) total += parseFloat(apv.rms) || 0;
        if (apv.atelier_mecanique) total += parseFloat(apv.atelier_mecanique) || 0;
        if (apv.atelier_carrosserie) total += parseFloat(apv.atelier_carrosserie) || 0;

        return total;
    };

    const updateTotals = () => {
        const vnTotal = calculateVNTotal();
        const apvTotal = calculateAPVTotal();
        const voTotal = parseFloat(data.vo) || 0;
        const parkingTotal = parseFloat(data.parking) || 0;

        const grandTotal = vnTotal + apvTotal + voTotal + parkingTotal;

        setData(prevData => ({
            ...prevData,
            vn: {
                ...prevData.vn,
                total: vnTotal
            },
            apv: {
                ...prevData.apv,
                total: apvTotal
            },
            total: grandTotal
        }));
    };

// Fonction pour gérer les changements de valeurs VN
    const handleVNChange = (field, value) => {
        const numValue = value === '' ? null : parseFloat(value);

        setData(prevData => {
            const newData = {
                ...prevData,
                vn: {
                    ...prevData.vn,
                    [field]: numValue
                }
            };

            // Recalculer le total VN
            let vnTotal = 0;
            if (newData.vn.show_room_dacia) vnTotal += parseFloat(newData.vn.show_room_dacia);
            if (newData.vn.show_room_renault) vnTotal += parseFloat(newData.vn.show_room_renault);
            if (newData.vn.show_room_nouvelle_marque) vnTotal += parseFloat(newData.vn.show_room_nouvelle_marque);
            if (newData.vn.zone_de_preparation) vnTotal += parseFloat(newData.vn.zone_de_preparation);

            // Mettre à jour le total VN
            newData.vn.total = vnTotal;

            // Calculer le grand total
            const apvTotal = parseFloat(newData.apv.total) || 0;
            const voTotal = parseFloat(newData.vo) || 0;
            const parkingTotal = parseFloat(newData.parking) || 0;
            newData.total = vnTotal + apvTotal + voTotal + parkingTotal;

            return newData;
        });
    };

// Fonction pour gérer les changements de valeurs APV
    const handleAPVChange = (field, value) => {
        const numValue = value === '' ? null : parseFloat(value);

        setData(prevData => {
            const newData = {
                ...prevData,
                apv: {
                    ...prevData.apv,
                    [field]: numValue
                }
            };

            // Recalculer le total APV
            let apvTotal = 0;
            if (newData.apv.rms) apvTotal += parseFloat(newData.apv.rms);
            if (newData.apv.atelier_mecanique) apvTotal += parseFloat(newData.apv.atelier_mecanique);
            if (newData.apv.atelier_carrosserie) apvTotal += parseFloat(newData.apv.atelier_carrosserie);

            // Mettre à jour le total APV
            newData.apv.total = apvTotal;

            // Calculer le grand total
            const vnTotal = parseFloat(newData.vn.total) || 0;
            const voTotal = parseFloat(newData.vo) || 0;
            const parkingTotal = parseFloat(newData.parking) || 0;
            newData.total = vnTotal + apvTotal + voTotal + parkingTotal;

            return newData;
        });
    };

// Fonction pour gérer les changements de VO et parking
    const handleSimpleChange = (field, value) => {
        const numValue = value === '' ? null : parseFloat(value);

        setData(prevData => {
            const newData = {
                ...prevData,
                [field]: numValue
            };

            // Calculer le grand total
            const vnTotal = parseFloat(newData.vn.total) || 0;
            const apvTotal = parseFloat(newData.apv.total) || 0;
            const voTotal = parseFloat(newData.vo) || 0;
            const parkingTotal = parseFloat(newData.parking) || 0;
            newData.total = vnTotal + apvTotal + voTotal + parkingTotal;

            return newData;
        });
    };

// Assurons-nous que les totaux sont calculés lors de l'initialisation
    useEffect(() => {
        updateTotals();
    }, []);

    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sites.update"), {
            onSuccess: () => setShowEditModal(false),
        });
    };

    return (
        <>
            {Width > 930 ? (
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">

                            {/* Aperçu image */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Aperçu de l'image</label>
                                <img src={`/storage/${siteToEdit.image}`} alt={data.name} className="w-48 rounded shadow-md" />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Changer la photo</label>
                                <input
                                    type="file"
                                    onChange={e => setData('image', e.target.files[0])}
                                    className="w-full border rounded px-3 py-1"
                                />
                                {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
                            </div>

                            {/* Nom et Web */}
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Nom du site</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Site Web</label>
                                    <input
                                        type="url"
                                        value={data.web}
                                        onChange={(e) => setData("web", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.web && <p className="mt-2 text-sm text-red-600">{errors.web}</p>}
                                </div>
                            </div>

                            {/* Email et Téléphone */}
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Téléphone</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                        placeholder="ex: 0520044128"
                                    />
                                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Adresse */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Adresse</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                    className="w-full border rounded px-3 py-1"
                                />
                                {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            {/* Latitude et Longitude */}
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.latitude}
                                        onChange={(e) => setData("latitude", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.latitude && <p className="mt-2 text-sm text-red-600">{errors.latitude}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={data.longitude}
                                        onChange={(e) => setData("longitude", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.longitude && <p className="mt-2 text-sm text-red-600">{errors.longitude}</p>}
                                </div>
                            </div>

                            {/* Ville et Titre Foncier */}
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Ville</label>
                                    <input
                                        type="text"
                                        value={data.ville}
                                        placeholder="Nom de la ville"
                                        onChange={(e) => setData("ville", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.ville && <p className="mt-2 text-sm text-red-600">{errors.ville}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Titre Foncier</label>
                                    <input
                                        type="text"
                                        value={data.titre_foncier}
                                        placeholder="Numéro du titre foncier"
                                        onChange={(e) => setData("titre_foncier", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.titre_foncier && <p className="mt-2 text-sm text-red-600">{errors.titre_foncier}</p>}
                                </div>
                            </div>

                            {/* Superficie Terrain et Zoning Urbanistique */}
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Superficie Terrain</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.superficie_terrain}
                                        placeholder="Superficie en m²"
                                        onChange={(e) => setData("superficie_terrain", e.target.value ? parseFloat(e.target.value) : null)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.superficie_terrain && <p className="mt-2 text-sm text-red-600">{errors.superficie_terrain}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Zoning Urbanistique</label>
                                    <input
                                        type="text"
                                        value={data.zoning_urbanistique}
                                        placeholder="Type de zone"
                                        onChange={(e) => setData("zoning_urbanistique", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.zoning_urbanistique && <p className="mt-2 text-sm text-red-600">{errors.zoning_urbanistique}</p>}
                                </div>
                            </div>

                            {/* Consistance et Surface GLA */}
                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Consistance</label>
                                    <input
                                        type="text"
                                        value={data.consistance}
                                        placeholder="Consistance du bien"
                                        onChange={(e) => setData("consistance", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.consistance && <p className="mt-2 text-sm text-red-600">{errors.consistance}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Surface GLA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.surface_gla}
                                        placeholder="Surface GLA en m²"
                                        onChange={(e) => setData("surface_gla", e.target.value ? parseFloat(e.target.value) : null)}
                                                className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.surface_gla && <p className="mt-2 text-sm text-red-600">{errors.surface_gla}</p>}
                                </div>
                            </div>

                            {/* Type Site */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Type Site</label>
                                <select
                                    value={data.type_site}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setData((prevData) => ({
                                            ...prevData,
                                            type_site: value,
                                            ...(value === "propre" && {
                                                exploitant: "",
                                                bailleur: "",
                                                date_effet: null,
                                                duree_bail: "",
                                                loyer_actuel: null,
                                                taux_revision: null,
                                                prochaine_revision: null,
                                            }),
                                        }));
                                    }}
                                    className="w-full border rounded px-3 py-1"
                                >
                                    <option value="propre">Propriété</option>
                                    <option value="location">Loué</option>
                                </select>
                                {errors.type_site && <p className="mt-2 text-sm text-red-600">{errors.type_site}</p>}
                            </div>

                            {/* Champs conditionnels pour location */}
                            {data.type_site && data.type_site === "location" ? (
                                <>
                                    {/* Exploitant et Bailleur */}
                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Exploitant</label>
                                            <input
                                                type="text"
                                                value={data.exploitant}
                                                placeholder="Nom de l'exploitant"
                                                onChange={(e) => setData("exploitant", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.exploitant && <p className="mt-2 text-sm text-red-600">{errors.exploitant}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Bailleur</label>
                                            <input
                                                type="text"
                                                value={data.bailleur}
                                                placeholder="Nom du bailleur"
                                                onChange={(e) => setData("bailleur", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.bailleur && <p className="mt-2 text-sm text-red-600">{errors.bailleur}</p>}
                                        </div>
                                    </div>

                                    {/* Date Effet et Durée Bail */}
                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Date Effet</label>
                                            <input
                                                type="date"
                                                value={data.date_effet}
                                                onChange={(e) => setData("date_effet", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.date_effet && <p className="mt-2 text-sm text-red-600">{errors.date_effet}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Durée Bail</label>
                                            <input
                                                type="text"
                                                value={data.duree_bail}
                                                placeholder="Durée du bail (ex: 3 ans)"
                                                onChange={(e) => setData("duree_bail", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.duree_bail && <p className="mt-2 text-sm text-red-600">{errors.duree_bail}</p>}
                                        </div>
                                    </div>

                                    {/* Loyer Actuel et Taux Révision */}
                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Loyer Actuel</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.loyer_actuel}
                                                placeholder="Montant du loyer actuel"
                                                onChange={(e) => setData("loyer_actuel", e.target.value ? parseFloat(e.target.value) : null)}
                                                        className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.loyer_actuel && <p className="mt-2 text-sm text-red-600">{errors.loyer_actuel}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Taux Révision</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.taux_revision}
                                                placeholder="Taux de révision en %"
                                                onChange={(e) => setData("taux_revision", e.target.value ? parseFloat(e.target.value) : null)}
                                                        className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.taux_revision && <p className="mt-2 text-sm text-red-600">{errors.taux_revision}</p>}
                                        </div>
                                    </div>

                                    {/* Prochaine Révision */}
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Prochaine Révision</label>
                                        <input
                                            type="date"
                                            value={data.prochaine_revision}
                                            onChange={(e) => setData("prochaine_revision", e.target.value)}
                                                    className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.prochaine_revision && <p className="mt-2 text-sm text-red-600">{errors.prochaine_revision}</p>}
                                    </div>
                                </>
                            ) : null}

                            {/* Véhicules Neufs (VN) */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Véhicules Neufs (VN)</h3>
                                <div className="mb-6 flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="show_room_dacia" className="block text-sm font-bold mb-2">Show Room Dacia</label>
                                        <input
                                            id="show_room_dacia"
                                            type="number"
                                            step="0.01"
                                            value={data.vn.show_room_dacia || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleVNChange("show_room_dacia", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.vn?.show_room_dacia && <p className="text-sm text-red-600 mt-1">{errors.vn.show_room_dacia}</p>}
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="show_room_renault" className="block text-sm font-bold mb-2">Show Room Renault</label>
                                        <input
                                            id="show_room_renault"
                                            type="number"
                                            step="0.01"
                                            value={data.vn.show_room_renault || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleVNChange("show_room_renault", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.vn?.show_room_renault && <p className="text-sm text-red-600 mt-1">{errors.vn.show_room_renault}</p>}
                                    </div>
                                </div>

                                <div className="mb-6 flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="show_room_nouvelle_marque" className="block text-sm font-bold mb-2">Show Room Nouvelle Marque</label>
                                        <input
                                            id="show_room_nouvelle_marque"
                                            type="number"
                                            step="0.01"
                                            value={data.vn.show_room_nouvelle_marque || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleVNChange("show_room_nouvelle_marque", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.vn?.show_room_nouvelle_marque && <p className="text-sm text-red-600 mt-1">{errors.vn.show_room_nouvelle_marque}</p>}
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="zone_de_preparation" className="block text-sm font-bold mb-2">Zone de Préparation</label>
                                        <input
                                            id="zone_de_preparation"
                                            type="number"
                                            step="0.01"
                                            value={data.vn.zone_de_preparation || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleVNChange("zone_de_preparation", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.vn?.zone_de_preparation && <p className="text-sm text-red-600 mt-1">{errors.vn.zone_de_preparation}</p>}
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-4">Après-Vente (APV)</h3>
                                <div className="mb-6 flex gap-4">
                                    <div className="w-1/3">
                                        <label htmlFor="rms" className="block text-sm font-bold mb-2">RMS</label>
                                        <input
                                            id="rms"
                                            type="number"
                                            step="0.01"
                                            value={data.apv.rms || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleAPVChange("rms", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.apv?.rms && <p className="text-sm text-red-600 mt-1">{errors.apv.rms}</p>}
                                    </div>

                                    <div className="w-1/3">
                                        <label htmlFor="atelier_mecanique" className="block text-sm font-bold mb-2">Atelier Mécanique</label>
                                        <input
                                            id="atelier_mecanique"
                                            type="number"
                                            step="0.01"
                                            value={data.apv.atelier_mecanique || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleAPVChange("atelier_mecanique", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.apv?.atelier_mecanique && <p className="text-sm text-red-600 mt-1">{errors.apv.atelier_mecanique}</p>}
                                    </div>

                                    <div className="w-1/3">
                                        <label htmlFor="atelier_carrosserie" className="block text-sm font-bold mb-2">Atelier Carrosserie</label>
                                        <input
                                            id="atelier_carrosserie"
                                            type="number"
                                            step="0.01"
                                            value={data.apv.atelier_carrosserie || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleAPVChange("atelier_carrosserie", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.apv?.atelier_carrosserie && <p className="text-sm text-red-600 mt-1">{errors.apv.atelier_carrosserie}</p>}
                                    </div>
                                </div>

                                <div className="mb-6 flex gap-4">
                                    <div className="w-1/2">
                                        <label htmlFor="vo" className="block text-sm font-bold mb-2">VO</label>
                                        <input
                                            id="vo"
                                            type="number"
                                            step="0.01"
                                            value={data.vo || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleSimpleChange("vo", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.vo && <p className="text-sm text-red-600 mt-1">{errors.vo}</p>}
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="parking" className="block text-sm font-bold mb-2">Parking</label>
                                        <input
                                            id="parking"
                                            type="number"
                                            step="0.01"
                                            value={data.parking || ""}
                                            placeholder="Surface en m²"
                                            onChange={(e) => handleSimpleChange("parking", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.parking && <p className="text-sm text-red-600 mt-1">{errors.parking}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    type="button"
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                        processing ? "opacity-75 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {processing ? "Enregistrement..." : "Mettre à jour le site"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div> ) : (
                <div className="w-full px-2 py-1">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="p-3">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* Image Preview */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1">
                                        Aperçu de l'image
                                    </label>
                                    <img
                                        src={`/storage/${siteToEdit.image}`}
                                        alt={data.name}
                                        className="w-48 rounded shadow-md mb-2"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="image">
                                        Changer la photo
                                    </label>
                                    <input
                                        id="image"
                                        type="file"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        onChange={(e) => setData('image', e.target.files[0])}
                                    />
                                    {errors.image && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                {/* Site Name */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="name">
                                        Nom du site
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Website */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="web">
                                        Site Web
                                    </label>
                                    <input
                                        id="web"
                                        type="url"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.web}
                                        onChange={(e) => setData("web", e.target.value)}
                                    />
                                    {errors.web && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.web}
                                        </p>
                                    )}
                                </div>

                                {/* Email and Phone */}
                                <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                <div className="mb-2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="phone">
                                            Téléphone
                                        </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        placeholder="ex: 0520044128"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="address">
                                        Adresse
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.address}
                                        onChange={(e) => setData("address", e.target.value)}
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                {/* Latitude and Longitude */}
                                <div className="flex space-x-2 mb-2">
                                    <div className="w-1/2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="latitude">
                                            Latitude
                                        </label>
                                        <input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.latitude}
                                            onChange={(e) => setData("latitude", e.target.value)}
                                        />
                                        {errors.latitude && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.latitude}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="longitude">
                                            Longitude
                                        </label>
                                        <input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={data.longitude}
                                            onChange={(e) => setData("longitude", e.target.value)}
                                        />
                                        {errors.longitude && (
                                            <p className="mt-1 text-[10px] text-red-600">
                                                {errors.longitude}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="ville" className="block text-gray-700 text-xs font-bold mb-1">Ville</label>
                                    <input
                                        id="ville"
                                        type="text"
                                        value={data.ville}
                                        placeholder="Nom de la ville"
                                        onChange={(e) => setData("ville", e.target.value)}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.ville && <p className="mt-1 text-[10px] text-red-600">{errors.ville}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="titre_foncier" className="block text-gray-700 text-xs font-bold mb-1">Titre Foncier</label>
                                    <input
                                        id="titre_foncier"
                                        type="text"
                                        value={data.titre_foncier}
                                        placeholder="Numéro du titre foncier"
                                        onChange={(e) => setData("titre_foncier", e.target.value)}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.titre_foncier && <p className="mt-1 text-[10px] text-red-600">{errors.titre_foncier}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="superficie_terrain" className="block text-gray-700 text-xs font-bold mb-1">Superficie Terrain</label>
                                    <input
                                        id="superficie_terrain"
                                        type="number"
                                        step="0.01"
                                        value={data.superficie_terrain}
                                        placeholder="Superficie en m²"
                                        onChange={(e) => setData("superficie_terrain", e.target.value ? parseFloat(e.target.value) : null)}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.superficie_terrain && <p className="mt-1 text-[10px] text-red-600">{errors.superficie_terrain}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="zoning_urbanistique" className="block text-gray-700 text-xs font-bold mb-1">Zoning Urbanistique</label>
                                    <input
                                        id="zoning_urbanistique"
                                        type="text"
                                        value={data.zoning_urbanistique}
                                        placeholder="Type de zone"
                                        onChange={(e) => setData("zoning_urbanistique", e.target.value)}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.zoning_urbanistique && <p className="mt-1 text-[10px] text-red-600">{errors.zoning_urbanistique}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="consistance" className="block text-gray-700 text-xs font-bold mb-1">Consistance</label>
                                    <input
                                        id="consistance"
                                        type="text"
                                        value={data.consistance}
                                        placeholder="Consistance du bien"
                                        onChange={(e) => setData("consistance", e.target.value)}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.consistance && <p className="mt-1 text-[10px] text-red-600">{errors.consistance}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="surface_gla" className="block text-gray-700 text-xs font-bold mb-1">Surface GLA</label>
                                    <input
                                        id="surface_gla"
                                        type="number"
                                        step="0.01"
                                        value={data.surface_gla}
                                        placeholder="Surface GLA en m²"
                                        onChange={(e) => setData("surface_gla", e.target.value ? parseFloat(e.target.value) : null)}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.surface_gla && <p className="mt-1 text-[10px] text-red-600">{errors.surface_gla}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="type_site">
                                        Type Site
                                    </label>
                                    <select
                                        id="type_site"
                                        name="type_site"
                                        value={data.type_site}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData((prevData) => ({
                                                ...prevData,
                                                type_site: value,
                                                ...(value === "propre" && {
                                                    exploitant: "",
                                                    bailleur: "",
                                                    date_effet: null,
                                                    duree_bail: "",
                                                    loyer_actuel: null,
                                                    taux_revision: null,
                                                    prochaine_revision: null,
                                                }),
                                            }));
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                                        <option value="propre">Propriété</option>
                                        <option value="location">Loué</option>
                                    </select>
                                    {errors.type_site && <p className="mt-1 text-[10px] text-red-600">{errors.type_site}</p>}
                                </div>

                                {data.type_site && data.type_site === "location" ? (
                                    <>
                                        <div className="mb-2">
                                            <label htmlFor="exploitant" className="block text-gray-700 text-xs font-bold mb-1">Exploitant</label>
                                            <input
                                                id="exploitant"
                                                type="text"
                                                value={data.exploitant}
                                                placeholder="Nom de l'exploitant"
                                                onChange={(e) => setData("exploitant", e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                            {errors.exploitant && <p className="mt-1 text-[10px] text-red-600">{errors.exploitant}</p>}
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="bailleur" className="block text-gray-700 text-xs font-bold mb-1">Bailleur</label>
                                            <input
                                                id="bailleur"
                                                type="text"
                                                value={data.bailleur}
                                                placeholder="Nom du bailleur"
                                                onChange={(e) => setData("bailleur", e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                            {errors.bailleur && <p className="mt-1 text-[10px] text-red-600">{errors.bailleur}</p>}
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="date_effet" className="block text-gray-700 text-xs font-bold mb-1">Date Effet</label>
                                            <input
                                                id="date_effet"
                                                type="date"
                                                value={data.date_effet}
                                                onChange={(e) => setData("date_effet", e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                            {errors.date_effet && <p className="mt-1 text-[10px] text-red-600">{errors.date_effet}</p>}
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="duree_bail" className="block text-gray-700 text-xs font-bold mb-1">Durée Bail</label>
                                            <input
                                                id="duree_bail"
                                                type="text"
                                                value={data.duree_bail}
                                                placeholder="Durée du bail (ex: 3 ans)"
                                                onChange={(e) => setData("duree_bail", e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                            {errors.duree_bail && <p className="mt-1 text-[10px] text-red-600">{errors.duree_bail}</p>}
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="loyer_actuel" className="block text-gray-700 text-xs font-bold mb-1">Loyer Actuel</label>
                                            <input
                                                id="loyer_actuel"
                                                type="number"
                                                step="0.01"
                                                value={data.loyer_actuel}
                                                placeholder="Montant du loyer actuel"
                                                onChange={(e) => setData("loyer_actuel", e.target.value ? parseFloat(e.target.value) : null)}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                            {errors.loyer_actuel && <p className="mt-1 text-[10px] text-red-600">{errors.loyer_actuel}</p>}
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="taux_revision" className="block text-gray-700 text-xs font-bold mb-1">Taux Révision</label>
                                            <input
                                                id="taux_revision"
                                                type="number"
                                                step="0.01"
                                                value={data.taux_revision}
                                                placeholder="Taux de révision en %"
                                                onChange={(e) => setData("taux_revision", e.target.value ? parseFloat(e.target.value) : null)}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                            {errors.taux_revision && <p className="mt-1 text-[10px] text-red-600">{errors.taux_revision}</p>}
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="prochaine_revision" className="block text-gray-700 text-xs font-bold mb-1">Prochaine Révision</label>
                                            <input
                                                id="prochaine_revision"
                                                type="date"
                                                value={data.prochaine_revision}
                                                onChange={(e) => setData("prochaine_revision", e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                            {errors.prochaine_revision && <p className="mt-1 text-[10px] text-red-600">{errors.prochaine_revision}</p>}
                                        </div>
                                    </>
                                ) : null}

                                <h3 className="text-md font-semibold mb-4">Véhicules Neufs (VN)</h3>
                                <div className="mb-2">
                                    <label htmlFor="show_room_dacia" className="block text-gray-700 text-xs font-bold mb-1">Show Room Dacia</label>
                                    <input
                                        id="show_room_dacia"
                                        type="number"
                                        step="0.01"
                                        value={data.vn.show_room_dacia || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("vn", {
                                                ...data.vn,
                                                show_room_dacia: value
                                            });
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.vn?.show_room_dacia && <p className="mt-1 text-[10px] text-red-600">{errors.vn.show_room_dacia}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="show_room_renault" className="block text-gray-700 text-xs font-bold mb-1">Show Room Renault</label>
                                    <input
                                        id="show_room_renault"
                                        type="number"
                                        step="0.01"
                                        value={data.vn.show_room_renault || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("vn", {
                                                ...data.vn,
                                                show_room_renault: value
                                            });
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.vn?.show_room_renault && <p className="mt-1 text-[10px] text-red-600">{errors.vn.show_room_renault}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="show_room_nouvelle_marque" className="block text-gray-700 text-xs font-bold mb-1">Show Room Nouvelle Marque</label>
                                    <input
                                        id="show_room_nouvelle_marque"
                                        type="number"
                                        step="0.01"
                                        value={data.vn.show_room_nouvelle_marque || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("vn", {
                                                ...data.vn,
                                                show_room_nouvelle_marque: value
                                            });
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.vn?.show_room_nouvelle_marque && <p className="mt-1 text-[10px] text-red-600">{errors.vn.show_room_nouvelle_marque}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="zone_de_preparation" className="block text-gray-700 text-xs font-bold mb-1">Zone de Préparation</label>
                                    <input
                                        id="zone_de_preparation"
                                        type="number"
                                        step="0.01"
                                        value={data.vn.zone_de_preparation || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("vn", {
                                                ...data.vn,
                                                zone_de_preparation: value
                                            });
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.vn?.zone_de_preparation && <p className="mt-1 text-[10px] text-red-600">{errors.vn.zone_de_preparation}</p>}
                                </div>

                                <h3 className="text-md font-semibold mb-4">Après-Vente (APV)</h3>
                                <div className="mb-2">
                                    <label htmlFor="rms" className="block text-gray-700 text-xs font-bold mb-1">RMS</label>
                                    <input
                                        id="rms"
                                        type="number"
                                        step="0.01"
                                        value={data.apv.rms || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("apv", {
                                                ...data.apv,
                                                rms: value
                                            });
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.apv?.rms && <p className="mt-1 text-[10px] text-red-600">{errors.apv.rms}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="atelier_mecanique" className="block text-gray-700 text-xs font-bold mb-1">Atelier Mécanique</label>
                                    <input
                                        id="atelier_mecanique"
                                        type="number"
                                        step="0.01"
                                        value={data.apv.atelier_mecanique || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("apv", {
                                                ...data.apv,
                                                atelier_mecanique: value
                                            });
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.apv?.atelier_mecanique && <p className="mt-1 text-[10px] text-red-600">{errors.apv.atelier_mecanique}</p>}
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="atelier_carrosserie" className="block text-gray-700 text-xs font-bold mb-1">Atelier Carrosserie</label>
                                    <input
                                        id="atelier_carrosserie"
                                        type="number"
                                        step="0.01"
                                        value={data.apv.atelier_carrosserie || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("apv", {
                                                ...data.apv,
                                                atelier_carrosserie: value
                                            });
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.apv?.atelier_carrosserie && <p className="mt-1 text-[10px] text-red-600">{errors.apv.atelier_carrosserie}</p>}
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-md font-semibold mb-2">VO</h3>
                                    <input
                                        id="vo"
                                        type="number"
                                        step="0.01"
                                        value={data.vo || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("vo", value);
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.vo && <p className="mt-1 text-[10px] text-red-600">{errors.vo}</p>}
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-md font-semibold mb-2">Parking</h3>
                                    <input
                                        id="parking"
                                        type="number"
                                        step="0.01"
                                        value={data.parking || ""}
                                        placeholder="Surface en m²"
                                        onChange={(e) => {
                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                            setData("parking", value);
                                            updateTotals();
                                        }}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.parking && <p className="mt-1 text-[10px] text-red-600">{errors.parking}</p>}
                                </div>

                                <div className="flex space-x-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-1 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`flex-1 px-1 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-md hover:text-yellow-900 transition ${
                                            processing ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    >
                                        {processing ? "Enregistrement..." : "Mettre à jour le site"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EditSite;
