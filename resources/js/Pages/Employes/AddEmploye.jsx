import React from 'react';
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