import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function AddNewContract({ employe, setShowAddContrat }) {
    const { flash } = usePage().props;
    const lastContract = employe.contrats?.sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin))[0];
    const minStartDate = lastContract?.date_fin ? new Date(lastContract.date_fin) : new Date();

    minStartDate.setDate(minStartDate.getDate() + 1);

    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        employe_id: employe.id,
        type_contrat: 'CDI',
        reference: '',
        titre: '',
        date_debut: today,
        date_fin: '',
        poste: employe.poste || '',
        salaire_mensuel: '',
        taux_horaire: '',
        taux_heures_supp: '',
        montant_fixe: '',
        mode_paiement: 'mensuel',
        document: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contrats.create'));
    };

    const handleFileChange = (e) => {
        setData('document', e.target.files[0]);
    };

    const handleCancel = () => {
        setShowAddContrat(false);
    };

    useEffect(() => {
        if (flash?.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash?.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    return (
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Nouveau contrat pour {employe.user.name}</h3>
                        <p className="text-sm text-gray-500">Matricule: {employe.matricule} | Poste: {employe.poste} | Département: {employe.departement?.name}</p>
                        {lastContract && (
                            <p className="text-sm text-red-500 mt-2">
                                Dernier contrat: {lastContract.type_contrat} (fin: {new Date(lastContract.date_fin).toLocaleDateString('fr-FR')})
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Type de contrat
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-1"
                                        value={data.type_contrat}
                                        onChange={(e) => setData('type_contrat', e.target.value)}
                                    >
                                        <option value="CDI">CDI</option>
                                        <option value="CDD">CDD</option>
                                        <option value="Stage">Stage</option>
                                        <option value="Alternance">Alternance</option>
                                        <option value="Interim">Intérim</option>
                                    </select>
                                    {errors.type_contrat && <p className="mt-2 text-sm text-red-600">{errors.type_contrat}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Référence du contrat
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-1"
                                        value={data.reference}
                                        onChange={(e) => setData('reference', e.target.value)}
                                    />
                                    {errors.reference && <p className="mt-2 text-sm text-red-600">{errors.reference}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border rounded px-3 py-1"
                                        value={data.date_debut}
                                        min={today}
                                        onChange={(e) => setData('date_debut', e.target.value)}
                                    />
                                    {errors.date_debut && <p className="mt-2 text-sm text-red-600">{errors.date_debut}</p>}
                                </div>

                                {data.type_contrat !== 'CDI' && (
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Date de fin
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border rounded px-3 py-1"
                                            value={data.date_fin}
                                            min={data.date_debut}
                                            onChange={(e) => setData('date_fin', e.target.value)}
                                        />
                                        {errors.date_fin && <p className="mt-2 text-sm text-red-600">{errors.date_fin}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Titre du poste
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-1"
                                        value={data.titre}
                                        onChange={(e) => setData('titre', e.target.value)}
                                    />
                                    {errors.titre && <p className="mt-2 text-sm text-red-600">{errors.titre}</p>}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Mode de paiement
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-1"
                                        value={data.mode_paiement}
                                        onChange={(e) => setData('mode_paiement', e.target.value)}
                                    >
                                        <option value="mensuel">Mensuel</option>
                                        <option value="horaire">Horaire</option>
                                        <option value="forfaitaire">Forfaitaire</option>
                                    </select>
                                    {errors.mode_paiement && <p className="mt-2 text-sm text-red-600">{errors.mode_paiement}</p>}
                                </div>

                                {data.mode_paiement === 'mensuel' && (
                                    <div className="col-span-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Salaire mensuel (MAD)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            className="w-full border rounded px-3 py-1"
                                            value={data.salaire_mensuel}
                                            onChange={(e) => setData('salaire_mensuel', e.target.value)}
                                        />
                                        {errors.salaire_mensuel && <p className="mt-2 text-sm text-red-600">{errors.salaire_mensuel}</p>}
                                    </div>
                                )}

                                {data.mode_paiement === 'horaire' && (
                                    <>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Taux horaire (MAD)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                className="w-full border rounded px-3 py-1"
                                                value={data.taux_horaire}
                                                onChange={(e) => setData('taux_horaire', e.target.value)}
                                            />
                                            {errors.taux_horaire && <p className="mt-2 text-sm text-red-600">{errors.taux_horaire}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Taux heures supplémentaires (MAD)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                className="w-full border rounded px-3 py-1"
                                                value={data.taux_heures_supp}
                                                onChange={(e) => setData('taux_heures_supp', e.target.value)}
                                            />
                                            {errors.taux_heures_supp && <p className="mt-2 text-sm text-red-600">{errors.taux_heures_supp}</p>}
                                        </div>
                                    </>
                                )}

                                {data.mode_paiement === 'forfaitaire' && (
                                    <div className="col-span-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Montant fixe (MAD)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            className="w-full border rounded px-3 py-1"
                                            value={data.montant_fixe}
                                            onChange={(e) => setData('montant_fixe', e.target.value)}
                                        />
                                        {errors.montant_fixe && <p className="mt-2 text-sm text-red-600">{errors.montant_fixe}</p>}
                                    </div>
                                )}

                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Document du contrat (PDF)
                                    </label>
                                    <input
                                        type="file"
                                        className="w-full border rounded px-3 py-1"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx"
                                    />
                                    {errors.document && <p className="mt-2 text-sm text-red-600">{errors.document}</p>}
                                </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-colors ${
                                    processing ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                            >
                                {processing ? "Enregistrement..." : "Créer le contrat"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}