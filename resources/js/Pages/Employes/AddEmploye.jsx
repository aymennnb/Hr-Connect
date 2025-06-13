import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

function AddEmploye({ setShowAddForm }) {
    const { auth, departements } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '12345678',
        role: 'user',
        departement_id: '',
        matricule: '',
        poste: '',
        date_embauche: '',
        telephone: '',
        adresse: '',
        date_naissance: '',
        ville: '',
        etat_civil: '',
        genre: '',
        cnss: '',
        cin: '',
        photo: null,
        
        // Nouveaux champs pour le contrat
        contract_reference: '',
        contract_type: 'CDI',
        contract_titre: '',
        contract_date_debut: '',
        contract_date_fin: '',
        contract_salaire_mensuel: '',
        contract_taux_horaire: '',
        contract_taux_heures_supp: '',
        contract_montant_fixe: '',
        contract_mode_paiement: 'mensuel',
        contract_document_path: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employes.create'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddForm(false);
            },
        });
    };

    const handleFileChange = (e) => {
        setData('photo', e.target.files[0]);
    };

    const handleContractFileChange = (e) => {
        setData('contract_document_path', e.target.files[0]);
    };

    useEffect(() => {
        if (data.date_embauche) {
            setData('contract_date_debut', data.date_embauche);
        }
    }, [data.date_embauche]);

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Ajouter un nouvel employé</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Matricule
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.matricule}
                                    onChange={(e) => setData('matricule', e.target.value)}
                                />
                                {errors.matricule && <p className="mt-2 text-sm text-red-600">{errors.matricule}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Département
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-1"
                                    value={data.departement_id}
                                    onChange={(e) => setData('departement_id', e.target.value)}
                                >
                                    <option value="">Sélectionner un département</option>
                                    {departements.map((departement) => (
                                        <option key={departement.id} value={departement.id}>
                                            {departement.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.departement_id && <p className="mt-2 text-sm text-red-600">{errors.departement_id}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Poste
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.poste}
                                    onChange={(e) => setData('poste', e.target.value)}
                                />
                                {errors.poste && <p className="mt-2 text-sm text-red-600">{errors.poste}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Date d'embauche
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.date_embauche}
                                    onChange={(e) => setData('date_embauche', e.target.value)}
                                    min={today}
                                />
                                {errors.date_embauche && <p className="mt-2 text-sm text-red-600">{errors.date_embauche}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="number"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value)}
                                />
                                {errors.telephone && <p className="mt-2 text-sm text-red-600">{errors.telephone}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Photo
                                </label>
                                <input
                                    type="file"
                                    className="w-full border rounded px-3 py-1"
                                    onChange={handleFileChange}
                                />
                                {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
                            </div>

                            {/* Section Informations Personnelles */}
                            <div className="col-span-2 mt-4">
                                <h4 className="font-semibold text-gray-800 mb-3">Informations personnelles</h4>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Adresse
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.adresse}
                                    onChange={(e) => setData('adresse', e.target.value)}
                                />
                                {errors.adresse && <p className="mt-2 text-sm text-red-600">{errors.adresse}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Date de naissance
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.date_naissance}
                                    onChange={(e) => setData('date_naissance', e.target.value)}
                                />
                                {errors.date_naissance && <p className="mt-2 text-sm text-red-600">{errors.date_naissance}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Ville
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.ville}
                                    onChange={(e) => setData('ville', e.target.value)}
                                />
                                {errors.ville && <p className="mt-2 text-sm text-red-600">{errors.ville}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    État civil
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-1"
                                    value={data.etat_civil}
                                    onChange={(e) => setData('etat_civil', e.target.value)}
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="celibataire">Célibataire</option>
                                    <option value="marie">Marié{data.genre ==="F"?"e":null}</option>
                                    <option value="divorce">Divorcé{data.genre ==="F"?"e":null}</option>
                                    <option value="veuf">Veu{data.genre ==="F"?"fve":'f'}</option>
                                </select>
                                {errors.etat_civil && <p className="mt-2 text-sm text-red-600">{errors.etat_civil}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Genre
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-1"
                                    value={data.genre}
                                    onChange={(e) => setData('genre', e.target.value)}
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="H">Homme</option>
                                    <option value="F">Femme</option>
                                </select>
                                {errors.genre && <p className="mt-2 text-sm text-red-600">{errors.genre}</p>}
                            </div>

                            {/* Section Informations Administratives */}
                            <div className="col-span-2 mt-4">
                                <h4 className="font-semibold text-gray-800 mb-3">Informations administratives</h4>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Numéro CNSS
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.cnss}
                                    onChange={(e) => setData('cnss', e.target.value)}
                                />
                                {errors.cnss && <p className="mt-2 text-sm text-red-600">{errors.cnss}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    CIN
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.cin}
                                    onChange={(e) => setData('cin', e.target.value)}
                                />
                                {errors.cin && <p className="mt-2 text-sm text-red-600">{errors.cin}</p>}
                            </div>
                        </div>

                        <div className="col-span-2 mt-4">
                                <h4 className="font-semibold text-gray-800 mb-3">Informations du contrat</h4>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Référence du contrat
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.contract_reference}
                                    onChange={(e) => setData('contract_reference', e.target.value)}
                                />
                                {errors.contract_reference && <p className="mt-2 text-sm text-red-600">{errors.contract_reference}</p>}
                            </div>

                            <div >
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Type de contrat
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-1"
                                    value={data.contract_type}
                                    onChange={(e) => setData('contract_type', e.target.value)}
                                >
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="Stage">Stage</option>
                                    <option value="Alternance">Alternance</option>
                                    <option value="Interim">Intérim</option>
                                </select>
                                {errors.contract_type && <p className="mt-2 text-sm text-red-600">{errors.contract_type}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Titre du poste
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.contract_titre}
                                    onChange={(e) => setData('contract_titre', e.target.value)}
                                />
                                {errors.contract_titre && <p className="mt-2 text-sm text-red-600">{errors.contract_titre}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded px-3 py-1"
                                    value={data.contract_date_debut}
                                    onChange={(e) => setData('contract_date_debut', e.target.value)}
                                    readOnly
                                />
                            </div>

                            {data.contract_type !== 'CDI' && (
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border rounded px-3 py-1"
                                        value={data.contract_date_fin}
                                        onChange={(e) => setData('contract_date_fin', e.target.value)}
                                        min={data.contract_date_debut}
                                    />
                                    {errors.contract_date_fin && <p className="mt-2 text-sm text-red-600">{errors.contract_date_fin}</p>}
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Mode de paiement
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-1"
                                    value={data.contract_mode_paiement}
                                    onChange={(e) => setData('contract_mode_paiement', e.target.value)}
                                >
                                    <option value="mensuel">Mensuel</option>
                                    <option value="horaire">Horaire</option>
                                    <option value="forfaitaire">Forfaitaire</option>
                                </select>
                                {errors.contract_mode_paiement && <p className="mt-2 text-sm text-red-600">{errors.contract_mode_paiement}</p>}
                            </div>

                            {data.contract_mode_paiement === 'mensuel' && (
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Salaire mensuel (MAD)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        className="w-full border rounded px-3 py-1"
                                        value={data.contract_salaire_mensuel}
                                        onChange={(e) => setData('contract_salaire_mensuel', e.target.value)}
                                    />
                                    {errors.contract_salaire_mensuel && <p className="mt-2 text-sm text-red-600">{errors.contract_salaire_mensuel}</p>}
                                </div>
                            )}

                            {data.contract_mode_paiement === 'horaire' && (
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
                                            value={data.contract_taux_horaire}
                                            onChange={(e) => setData('contract_taux_horaire', e.target.value)}
                                        />
                                        {errors.contract_taux_horaire && <p className="mt-2 text-sm text-red-600">{errors.contract_taux_horaire}</p>}
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
                                            value={data.contract_taux_heures_supp}
                                            onChange={(e) => setData('contract_taux_heures_supp', e.target.value)}
                                        />
                                        {errors.contract_taux_heures_supp && <p className="mt-2 text-sm text-red-600">{errors.contract_taux_heures_supp}</p>}
                                    </div>
                                </>
                            )}

                            {data.contract_mode_paiement === 'forfaitaire' && (
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Montant fixe (MAD)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        className="w-full border rounded px-3 py-1"
                                        value={data.contract_montant_fixe}
                                        onChange={(e) => setData('contract_montant_fixe', e.target.value)}
                                    />
                                    {errors.contract_montant_fixe && <p className="mt-2 text-sm text-red-600">{errors.contract_montant_fixe}</p>}
                                </div>
                            )}

                            <div className="col-span-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Document du contrat (PDF)
                                </label>
                                <input
                                    type="file"
                                    className="w-full border rounded px-3 py-1"
                                    onChange={handleContractFileChange}
                                    accept=".pdf,.doc,.docx"
                                />
                                {errors.contract_document_path && <p className="mt-2 text-sm text-red-600">{errors.contract_document_path}</p>}
                            </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
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
                                {processing ? "Enregistrement..." : "Ajouter l'employé"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddEmploye;