import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

function AddSalaire({ setShowAddForm, employes, salaires }) { 

    const [availableMonths, setAvailableMonths] = useState([]);
    const filteredEmployes = employes.filter(employe => employe.current_contract);

    const { data, setData, post, processing, errors } = useForm({
        employe_id: '',
        mois: new Date().toISOString().slice(0, 7),
        salaire_base: 0,
        prime: 0,
        salaire_mensuel: 0,
        taux_horaire: 0,
        taux_heures_supp: 0,
        montant_fixe: 0,
        heures_sup: 0,
        retenue: 0,
        mode_paiement: '',
    });

    const calculateWorkingDays = (year, month) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        let workingDays = 0;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(year, month - 1, day).getDay();
            if (currentDay !== 0 && currentDay !== 6) {
                workingDays++;
            }
        }
        
        return workingDays;
    };

    useEffect(() => {
        if (data.employe_id) {
            const employe = employes.find(e => e.id == data.employe_id);
            const contrat = employe?.current_contract;

            if (contrat) {
                const [year, month] = data.mois.split('-').map(Number);
                const workingDays = calculateWorkingDays(year, month);
                const workingHours = workingDays * 8;

                let baseSalary = 0;
                let heuresSupp = 0;

                switch(contrat.mode_paiement) {
                    case 'mensuel':
                        baseSalary = contrat.salaire_mensuel || 0;
                        break;
                    case 'horaire':
                        baseSalary = (contrat.taux_horaire || 0) * workingHours;
                        heuresSupp = (contrat.taux_heures_supp || 0) * (data.heures_sup || 0);
                        break;
                    case 'forfaitaire':
                        baseSalary = contrat.montant_fixe || 0;
                        break;
                    default:
                        baseSalary = 0;
                }

                setData({
                    ...data,
                    mode_paiement: contrat.mode_paiement,
                    salaire_base: baseSalary + heuresSupp,
                    salaire_mensuel: contrat.salaire_mensuel || 0,
                    taux_horaire: contrat.taux_horaire || 0,
                    taux_heures_supp: contrat.taux_heures_supp || 0,
                    montant_fixe: contrat.montant_fixe || 0,
                    heures_sup: contrat.mode_paiement === 'horaire' ? 0 : undefined,
                });
            }
        }
    }, [data.employe_id, data.mois]);

    useEffect(() => {
        if (data.mode_paiement === 'horaire' && data.employe_id) {
            const employe = employes.find(e => e.id == data.employe_id);
            const contrat = employe?.current_contract;
            
            if (contrat) {
                const heuresSupp = (contrat.taux_heures_supp || 0) * (data.heures_sup || 0);
                const [year, month] = data.mois.split('-').map(Number);
                const workingDays = calculateWorkingDays(year, month);
                const workingHours = workingDays * 8;
                const base = (contrat.taux_horaire || 0) * workingHours;
                
                setData('salaire_base', base + heuresSupp);
            }
        }
    }, [data.heures_sup]);

    useEffect(() => {
        if (data.employe_id && salaires) {
            const paidMonths = salaires
                .filter(s => s.employe_id == data.employe_id)
                .map(s => new Date(s.mois).toISOString().slice(0, 7));

            const currentDate = new Date();
            const months = [];
            
            for (let i = 0; i < 12; i++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const monthStr = date.toISOString().slice(0, 7);
                
                if (!paidMonths.includes(monthStr)) {
                    months.push(monthStr);
                }
            }

            setAvailableMonths(months);
            
            if (months.length > 0 && !months.includes(data.mois)) {
                setData('mois', months[0]);
            }
        } else {
            setAvailableMonths([]);
        }
    }, [data.employe_id, salaires]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('salaires.store'), {
            onSuccess: () => {
                setShowAddForm(false);
            }
        });
    };

    const renderPaymentFields = () => {
        if (!data.employe_id) return null;

        const employe = employes.find(e => e.id == data.employe_id);
        const contrat = employe?.current_contract;

        if (!contrat) {
            return (
                <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 rounded">
                    Aucun contrat actif trouvé pour cet employé
                </div>
            );
        }

        switch(contrat.mode_paiement) {
            case 'mensuel':
                return (
                   <>
                      <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Salaire de Base Calculé (MAD)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full border rounded px-3 py-1"
                                value={data.salaire_base}
                                readOnly
                            />
                        </div>
                    <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Salaire Mensuel (MAD)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full border rounded px-3 py-1"
                                value={data.salaire_mensuel}
                                readOnly
                            />
                    </div>
                   </>
                );
            
            case 'horaire':
                return (
                    <>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Salaire de Base Calculé (MAD)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full border rounded px-3 py-1"
                                value={data.salaire_base}
                                readOnly
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Taux Horaire (MAD)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full border rounded px-3 py-1"
                                value={data.taux_horaire}
                                readOnly
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Heures Supplémentaires
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="w-full border rounded px-3 py-1"
                                value={data.heures_sup || 0}
                                onChange={(e) => setData("heures_sup", e.target.value)}
                            />
                            {errors.heures_sup && <p className="mt-2 text-sm text-red-600">{errors.heures_sup}</p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Taux Heures Supp (MAD)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full border rounded px-3 py-1"
                                value={data.taux_heures_supp}
                                readOnly
                            />
                        </div>
                    </>
                );
            
            case 'forfaitaire':
                return (
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Montant Fixe (MAD)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                                className="w-full border rounded px-3 py-1"
                            value={data.montant_fixe}
                            readOnly
                        />
                    </div>
                );
            
            default:
                return (
                    <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 rounded">
                        Mode de paiement non reconnu: {contrat.mode_paiement}
                    </div>
                );
        }
    };

    return (
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Champs employé et mois (inchangés) */}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employe_id">
                                Employé
                            </label>
                            <select
                                id="employe_id"
                                className="w-full border rounded px-3 py-1"
                                value={data.employe_id}
                                onChange={(e) => setData("employe_id", e.target.value)}
                            >
                                <option value="">Sélectionner un employé</option>
                                {filteredEmployes.map(employe => (
                                    <option key={employe.id} value={employe.id}>
                                        {employe.user?.name}
                                    </option>
                                ))}
                            </select>
                            {errors.employe_id && <p className="mt-2 text-sm text-red-600">{errors.employe_id}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mois">
                                Mois
                            </label>
                            <select
                                id="mois"
                                className="w-full border rounded px-3 py-1"
                                value={data.mois}
                                onChange={(e) => setData("mois", e.target.value)}
                                disabled={!data.employe_id || availableMonths.length === 0}
                            >
                                {availableMonths.length > 0 ? (
                                    availableMonths.map(month => (
                                        <option key={month} value={month}>
                                            {new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">
                                        {data.employe_id ? 'Aucun mois disponible' : 'Sélectionnez d\'abord un employé'}
                                    </option>
                                )}
                            </select>
                            {errors.mois && <p className="mt-2 text-sm text-red-600">{errors.mois}</p>}
                        </div>

                        {data.employe_id && (
                            <div className="mb-4 p-3 bg-gray-50 rounded">
                                <h4 className="font-medium mb-2">
                                    Mode de paiement: <span className="font-semibold">
                                        {employes.find(e => e.id == data.employe_id)?.current_contract?.mode_paiement || 'Non spécifié'}
                                    </span>
                                </h4>
                            </div>
                        )}

                        {renderPaymentFields()}

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prime">
                                Prime (MAD)
                            </label>
                            <input
                                id="prime"
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full border rounded px-3 py-1"
                                value={data.prime}
                                onChange={(e) => setData("prime", e.target.value)}
                            />
                            {errors.prime && <p className="mt-2 text-sm text-red-600">{errors.prime}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="retenue">
                                Retenues (MAD)
                            </label>
                            <input
                                id="retenue"
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full border rounded px-3 py-1"
                                value={data.retenue}
                                onChange={(e) => setData("retenue", e.target.value)}
                            />
                            {errors.retenue && <p className="mt-2 text-sm text-red-600">{errors.retenue}</p>}
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                                    processing ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                            >
                                {processing ? "Envoi en cours..." : "Effectué le paiement"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddSalaire;