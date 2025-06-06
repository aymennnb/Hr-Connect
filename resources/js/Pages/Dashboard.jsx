import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";
import moment from 'moment';
import 'moment/locale/fr'; // Importez la locale française

function StatsCard({ title, value, icon, bgColor }) {
  return (
    <div className={`p-4 rounded-lg shadow-sm ${bgColor} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium opacity-75">{title}</h4>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-white opacity-75">{icon}</div>
      </div>
    </div>
  );
}

function SimpleTable({ title, headers, data }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-semibold text-base mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard({ 
  auth, 
  totalEmployees, 
  departmentsCount, 
  leaveRequestsCount,
  employeesByDepartment,
  leaveRequestsByStatus,
  alerts,
  users
}) {
  // Formatage des données pour les tableaux
  const employeesByDeptData = employeesByDepartment.map(dept => [
    dept.departement_name, 
    dept.employees_count
  ]);

  const leavesByStatusData = leaveRequestsByStatus.map(status => {
    // Traduction des statuts avec mise en forme cohérente
    const statusLabels = {
      'en_attente': 'En attente',
      'accepte': 'Accepté',
      'refuse': 'Refusé'
    };
    
    return [
      `Congé ${statusLabels[status.status] || status.status}`,
      status.total
    ];
  });

  // Tri et formatage des activités récentes
const recentActivitiesData = alerts
    .filter(alert => {

     if (alert.role === "superadmin") return false;
      
      const actor = users.find(user => user.id === alert.user_id);
      return actor?.role !== "superadmin";
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map(alert => {
      const actor = users.find(user => user.id === alert.user_id);
      const actorName = actor?.name || "Inconnu";
      const actorRole = actor?.role || "inconnu";
      
      let fullMessage;
      if (actorRole === "admin") {
        fullMessage = `L'admin ${actorName} ${alert.message}`;
      } else if (actorRole === "manager") {
        fullMessage = `Le Responsable RH ${actorName} ${alert.message}`;
      } else {
        fullMessage = `L'employé ${actorName} ${alert.message}`;
      }

      return [
        moment(alert.created_at).locale('fr').fromNow(),
        fullMessage
      ];
    });

  // Date du jour formatée
  const today = moment().locale('fr').format('dddd D MMMM YYYY');

  return (
    <Authenticated 
      user={auth.user} 
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tableau de bord RH</h2>}
    >
      <Head title="Tableau de bord" />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Date du jour */}
          <div className="mb-6 text-lg font-medium text-gray-600">
            {today}
          </div>

          {/* Cartes de statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total des employés"
              value={totalEmployees}
              bgColor="bg-blue-500"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Nombre de départements"
              value={departmentsCount}
              bgColor="bg-green-500"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <StatsCard
              title="Demandes de congé"
              value={leaveRequestsCount}
              bgColor="bg-yellow-500"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatsCard
              title="Masse salariale"
              value="0 DH"
              bgColor="bg-purple-500"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Tableaux de données */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleTable
              title="Employés par département"
              headers={["Département", "Nombre"]}
              data={employeesByDeptData}
            />

            <SimpleTable
              title="Demandes de congé par statut"
              headers={["Statut", "Nombre"]}
              data={leavesByStatusData}
            />
          </div>

          {/* Journal des activités */}
          <div className="mt-6">
            <SimpleTable
              title="Activités récentes"
              headers={["Date", "Action"]}
              data={recentActivitiesData.length > 0 ? recentActivitiesData : [["--", "Aucune activité récente"]]}
            />
          </div>
        </div>
      </div>
    </Authenticated>
  );
}