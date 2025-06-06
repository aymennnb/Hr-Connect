import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";

export default function AddSite({ auth, setShowAddForm }) {
    const { data, setData, processing, post, errors } = useForm({
        name: "",
        web: "",
        email: "",
        phone: "",
        address: "",
        latitude: "",
        longitude: "",
        image: null,
        ville:"",
        titre_foncier:null,
        superficie_terrain:null,
        zoning_urbanistique:null,
        consistance:null,
        surface_gla:null,
        uploaded_by:auth.user.id,
        type_site:"propre",
        exploitant:"",
        bailleur:"",
        date_effet:null,
        duree_bail:"",
        loyer_actuel:null,
        taux_revision:null,
        prochaine_revision:null,
        total: null,
        vn: {
            total: null,
            show_room_dacia: null,
            show_room_renault: null,
            show_room_nouvelle_marque: null,
            zone_de_preparation: null,
        },
        apv: {
            total: null,
            rms: null,
            atelier_mecanique: null,
            atelier_carrosserie: null,
        },
        vo: null,
        parking: null,
    });

    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sites.create"),{
            onSuccess: () => {
                setShowAddForm(false);
            }
        });
    };

    // Fonction pour calculer les totaux
    const calculateVNTotal = () => {
        const { vn } = data;
        let total = 0;

        if (vn.show_room_dacia) total += parseFloat(vn.show_room_dacia);
        if (vn.show_room_renault) total += parseFloat(vn.show_room_renault);
        if (vn.show_room_nouvelle_marque) total += parseFloat(vn.show_room_nouvelle_marque);
        if (vn.zone_de_preparation) total += parseFloat(vn.zone_de_preparation);

        return total;
    };

    const calculateAPVTotal = () => {
        const { apv } = data;
        let total = 0;

        if (apv.rms) total += parseFloat(apv.rms);
        if (apv.atelier_mecanique) total += parseFloat(apv.atelier_mecanique);
        if (apv.atelier_carrosserie) total += parseFloat(apv.atelier_carrosserie);

        return total;
    };

    const updateTotals = () => {
        const vnTotal = calculateVNTotal();
        const apvTotal = calculateAPVTotal();
        const voTotal = data.vo || 0;
        const parkingTotal = data.parking || 0;

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
            total: vnTotal + apvTotal + voTotal + parkingTotal
        }));
    };

    return (
        <>
            {Width > 930 ? (
                <div>
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h3 className="text-lg font-medium mb-4">Fournir les informations du site</h3>
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="mb-4">
                                        <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                                            Photo pour ce site
                                        </label>
                                        <input
                                            id="image"
                                            type="file"
                                            className="w-full px-3 py-1 border border-gray-300 rounded-md"
                                            onChange={e => setData("image", e.target.files[0])}
                                        />
                                        {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                                    </div>

                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="name" className="block text-sm font-bold mb-2">Nom du site</label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                placeholder="Nom du site"
                                                onChange={(e) => setData("name", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="web" className="block text-sm font-bold mb-2">Site web</label>
                                            <input
                                                id="web"
                                                type="url"
                                                value={data.web}
                                                onChange={(e) => setData("web", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.web && <p className="text-sm text-red-600 mt-1">{errors.web}</p>}
                                        </div>
                                    </div>

                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="phone" className="block text-sm font-bold mb-2">Téléphone</label>
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

                                    <div className="mb-6">
                                        <label htmlFor="address" className="block text-sm font-bold mb-2">Adresse</label>
                                        <input
                                            id="address"
                                            type="text"
                                            value={data.address}
                                            placeholder="Adresse complète"
                                            onChange={(e) => setData("address", e.target.value)}
                                            className="w-full border rounded px-3 py-1"
                                        />
                                        {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                                    </div>

                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="latitude" className="block text-sm font-bold mb-2">Latitude</label>
                                            <input
                                                id="latitude"
                                                type="number"
                                                step="any"
                                                placeholder="Latitude (ex. 33.5731)"
                                                value={data.latitude}
                                                onChange={(e) => setData("latitude", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.latitude && <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="longitude" className="block text-sm font-bold mb-2">Longitude</label>
                                            <input
                                                id="longitude"
                                                type="number"
                                                step="any"
                                                placeholder="Longitude (ex. -7.5898)"
                                                value={data.longitude}
                                                onChange={(e) => setData("longitude", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>}
                                        </div>
                                    </div>

                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="ville" className="block text-sm font-bold mb-2">Ville</label>
                                            <input
                                                id="ville"
                                                type="text"
                                                value={data.ville}
                                                placeholder="Nom de la ville"
                                                onChange={(e) => setData("ville", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.ville && <p className="text-sm text-red-600 mt-1">{errors.ville}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="titre_foncier" className="block text-sm font-bold mb-2">Titre Foncier</label>
                                            <input
                                                id="titre_foncier"
                                                type="text"
                                                value={data.titre_foncier}
                                                placeholder="Numéro du titre foncier"
                                                onChange={(e) => setData("titre_foncier", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.titre_foncier && <p className="text-sm text-red-600 mt-1">{errors.titre_foncier}</p>}
                                        </div>
                                    </div>

                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="superficie_terrain" className="block text-sm font-bold mb-2">Superficie Terrain</label>
                                            <input
                                                id="superficie_terrain"
                                                type="number"
                                                step="0.01"
                                                value={data.superficie_terrain}
                                                placeholder="Superficie en m²"
                                                onChange={(e) => setData("superficie_terrain", e.target.value ? parseFloat(e.target.value) : null)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.superficie_terrain && <p className="text-sm text-red-600 mt-1">{errors.superficie_terrain}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="zoning_urbanistique" className="block text-sm font-bold mb-2">Zoning Urbanistique</label>
                                            <input
                                                id="zoning_urbanistique"
                                                type="text"
                                                value={data.zoning_urbanistique}
                                                placeholder="Type de zone"
                                                onChange={(e) => setData("zoning_urbanistique", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.zoning_urbanistique && <p className="text-sm text-red-600 mt-1">{errors.zoning_urbanistique}</p>}
                                        </div>
                                    </div>

                                    <div className="mb-6 flex gap-4">
                                        <div className="w-1/2">
                                            <label htmlFor="consistance" className="block text-sm font-bold mb-2">Consistance</label>
                                            <input
                                                id="consistance"
                                                type="text"
                                                value={data.consistance}
                                                placeholder="Consistance du bien"
                                                onChange={(e) => setData("consistance", e.target.value)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.consistance && <p className="text-sm text-red-600 mt-1">{errors.consistance}</p>}
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="surface_gla" className="block text-sm font-bold mb-2">Surface GLA</label>
                                            <input
                                                id="surface_gla"
                                                type="number"
                                                step="0.01"
                                                value={data.surface_gla}
                                                placeholder="Surface GLA en m²"
                                                onChange={(e) => setData("surface_gla", e.target.value ? parseFloat(e.target.value) : null)}
                                                className="w-full border rounded px-3 py-1"
                                            />
                                            {errors.surface_gla && <p className="text-sm text-red-600 mt-1">{errors.surface_gla}</p>}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type_site">
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
                                            className="w-full border rounded px-3 py-1"
                                        >
                                            <option value="propre">Propriété</option>
                                            <option value="location">Loué</option>
                                        </select>
                                        {errors.type_site && <p className="text-sm text-red-600 mt-1">{errors.type_site}</p>}
                                    </div>

                                    {data.type_site && data.type_site === "location" ? (
                                        <>
                                            <div className="mb-6 flex gap-4">
                                                <div className="w-1/2">
                                                    <label htmlFor="exploitant" className="block text-sm font-bold mb-2">Exploitant</label>
                                                    <input
                                                        id="exploitant"
                                                        type="text"
                                                        value={data.exploitant}
                                                        placeholder="Nom de l'exploitant"
                                                        onChange={(e) => setData("exploitant", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.exploitant && <p className="text-sm text-red-600 mt-1">{errors.exploitant}</p>}
                                                </div>

                                                <div className="w-1/2">
                                                    <label htmlFor="bailleur" className="block text-sm font-bold mb-2">Bailleur</label>
                                                    <input
                                                        id="bailleur"
                                                        type="text"
                                                        value={data.bailleur}
                                                        placeholder="Nom du bailleur"
                                                        onChange={(e) => setData("bailleur", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.bailleur && <p className="text-sm text-red-600 mt-1">{errors.bailleur}</p>}
                                                </div>
                                            </div>

                                            <div className="mb-6 flex gap-4">
                                                <div className="w-1/2">
                                                    <label htmlFor="date_effet" className="block text-sm font-bold mb-2">Date Effet</label>
                                                    <input
                                                        id="date_effet"
                                                        type="date"
                                                        value={data.date_effet}
                                                        onChange={(e) => setData("date_effet", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.date_effet && <p className="text-sm text-red-600 mt-1">{errors.date_effet}</p>}
                                                </div>

                                                <div className="w-1/2">
                                                    <label htmlFor="duree_bail" className="block text-sm font-bold mb-2">Durée Bail</label>
                                                    <input
                                                        id="duree_bail"
                                                        type="text"
                                                        value={data.duree_bail}
                                                        placeholder="Durée du bail (ex: 3 ans)"
                                                        onChange={(e) => setData("duree_bail", e.target.value)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.duree_bail && <p className="text-sm text-red-600 mt-1">{errors.duree_bail}</p>}
                                                </div>
                                            </div>

                                            <div className="mb-6 flex gap-4">
                                                <div className="w-1/2">
                                                    <label htmlFor="loyer_actuel" className="block text-sm font-bold mb-2">Loyer Actuel</label>
                                                    <input
                                                        id="loyer_actuel"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.loyer_actuel}
                                                        placeholder="Montant du loyer actuel"
                                                        onChange={(e) => setData("loyer_actuel", e.target.value ? parseFloat(e.target.value) : null)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.loyer_actuel && <p className="text-sm text-red-600 mt-1">{errors.loyer_actuel}</p>}
                                                </div>

                                                <div className="w-1/2">
                                                    <label htmlFor="taux_revision" className="block text-sm font-bold mb-2">Taux Révision</label>
                                                    <input
                                                        id="taux_revision"
                                                        type="number"
                                                        step="0.01"
                                                        value={data.taux_revision}
                                                        placeholder="Taux de révision en %"
                                                        onChange={(e) => setData("taux_revision", e.target.value ? parseFloat(e.target.value) : null)}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.taux_revision && <p className="text-sm text-red-600 mt-1">{errors.taux_revision}</p>}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <label htmlFor="prochaine_revision" className="block text-sm font-bold mb-2">Prochaine Révision</label>
                                                <input
                                                    id="prochaine_revision"
                                                    type="date"
                                                    value={data.prochaine_revision}
                                                    onChange={(e) => setData("prochaine_revision", e.target.value)}
                                                    className="w-full border rounded px-3 py-1"
                                                />
                                                {errors.prochaine_revision && <p className="text-sm text-red-600 mt-1">{errors.prochaine_revision}</p>}
                                            </div>
                                        </>
                                    ) : null}

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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("vn", {
                                                                ...data.vn,
                                                                show_room_dacia: value
                                                            });
                                                            updateTotals();
                                                        }}
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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("vn", {
                                                                ...data.vn,
                                                                show_room_renault: value
                                                            });
                                                            updateTotals();
                                                        }}
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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("vn", {
                                                                ...data.vn,
                                                                show_room_nouvelle_marque: value
                                                            });
                                                            updateTotals();
                                                        }}
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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("vn", {
                                                                ...data.vn,
                                                                zone_de_preparation: value
                                                            });
                                                            updateTotals();
                                                        }}
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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("apv", {
                                                                ...data.apv,
                                                                rms: value
                                                            });
                                                            updateTotals();
                                                        }}
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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("apv", {
                                                                ...data.apv,
                                                                atelier_mecanique: value
                                                            });
                                                            updateTotals();
                                                        }}
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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("apv", {
                                                                ...data.apv,
                                                                atelier_carrosserie: value
                                                            });
                                                            updateTotals();
                                                        }}
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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("vo", value);
                                                            updateTotals();
                                                        }}
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
                                                        onChange={(e) => {
                                                            const value = e.target.value ? parseFloat(e.target.value) : null;
                                                            setData("parking", value);
                                                            updateTotals();
                                                        }}
                                                        className="w-full border rounded px-3 py-1"
                                                    />
                                                    {errors.parking && <p className="text-sm text-red-600 mt-1">{errors.parking}</p>}
                                                </div>
                                            </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            {processing ? "Enregistrement..." : "Ajouter le site"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div> ) :
                (
            <div className="w-full px-2 py-1">
                <div className="bg-white shadow-sm rounded-md">
                    <div className="p-3">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Site Photo Input */}
                            <div className="mb-2">
                                <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="image">
                                    Photo du site
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

                            {/* Site Name and Website */}
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
                                        placeholder="Nom du site"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-[10px] text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="web">
                                        Site web
                                    </label>
                                    <input
                                        id="web"
                                        type="url"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        value={data.web}
                                        onChange={(e) => setData("web", e.target.value)}
                                        placeholder="URL du site"
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
                                        placeholder="Email de contact"
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
                                    placeholder="Adresse complète"
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
                                        placeholder="Ex: 33.5731"
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
                                        placeholder="Ex: -7.5898"
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
                                    {errors.apv?.rms && <p className="text-sm text-red-600 mt-1">{errors.apv.rms}</p>}
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
                                    {errors.apv?.atelier_mecanique && <p className="text-sm text-red-600 mt-1">{errors.apv.atelier_mecanique}</p>}
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
                                    {errors.apv?.atelier_carrosserie && <p className="text-sm text-red-600 mt-1">{errors.apv.atelier_carrosserie}</p>}
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
                                    {errors.vo && <p className="text-sm text-red-600 mt-1">{errors.vo}</p>}
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
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"                                    />
                                    {errors.parking && <p className="text-sm text-red-600 mt-1">{errors.parking}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 mt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
                                        processing ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {processing ? "Enregistrement..." : "Ajouter le site"}
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
