import { Head } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function IndexPublic({ salaires }) {
    return (
        <Authenticated>
            <Head title="Mon Salaire" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">Historique de mes salaires</h2>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mois
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Salaire de base
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prime
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Heures supplémentaires
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Retenues
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Salaire net
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date de traitement
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {salaires.map((salaire) => (
                                            <tr key={salaire.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(salaire.mois), 'MMMM yyyy', { locale: fr })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.salaire_base.toLocaleString('fr-FR')} €
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.prime.toLocaleString('fr-FR')} €
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.heures_sup} h
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {salaire.retenue.toLocaleString('fr-FR')} €
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                                    {salaire.salaire_net.toLocaleString('fr-FR')} €
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(salaire.date_traitement), 'dd/MM/yyyy', { locale: fr })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}