import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Pagination from "@/Components/Pagination";
import ConfirmDeleteEmploye from "@/Components/ConfirmDeleteEmploye";
import ConfirmEmployesDelete from "@/Components/ConfirmEmployesDelete";
import AddEmploye from "@/Pages/Employes/AddEmploye";
import EditEmploye from "@/Pages/Employes/EditEmploye";
import ModalWrapper from "@/Components/ModalWrapper";
import toast from "react-hot-toast";
import { TbPlayerTrackNextFilled, TbZoomReset } from "react-icons/tb";
import { FaBackward } from "react-icons/fa6";
import { TbUserEdit } from "react-icons/tb";
import { TiDeleteOutline } from "react-icons/ti";
import { BsPersonAdd } from "react-icons/bs";
import { TfiImport } from "react-icons/tfi";
import { FiSearch } from "react-icons/fi";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import MultiSelectDropdown from "@/Components/MultiSelectDropdown";
import { LiaUserEditSolid } from "react-icons/lia";
import DetailsEmploye from '@/Pages/Employes/DetailsEmploye';
import { CgDetailsMore } from "react-icons/cg";

function IndexEmployes({ auth, employes, departements, users, flash }) {
    const {
        data,
        setData,
        post,
        get,
        delete: destroy,
    } = useForm({
        employes_ids: [],
        searchTerm: "",
        matricule: "",
        poste: "",
        departement_id: "",
        start_date: "",
        end_date: "",
        genre: "",
        ville: "",
        etat_civil: "",
    });

    const width = useWindowWidth();

    const [showAddForm, setShowAddForm] = useState(false);
    const [employeToDelete, setEmployeToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [employeToEdit, setEmployeToEdit] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [employeToShowDetails, setEmployeToShowDetails] = useState(null);
    const [showEmployesDelete, setShowEmployesDelete] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredEmployes, setFilteredEmployes] = useState([]);
    const [showAddFileForm, setShowAddFileForm] = useState(false);
    const [selectedDepartements, setSelectedDepartements] = useState([]);

    const selectedEmployesToDelete = employes.filter((employe) =>
        data.employes_ids.includes(employe.id)
    );

    const resetFilters = () => {
        setData({
            ...data,
            searchTerm: "",
            matricule: "",
            poste: "",
            departement_id: "",
            start_date: "",
            end_date: "",
            genre: "",
            ville: "",
            etat_civil: "",
        });
        setSelectedDepartements([]);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (!employes) return;

        let filtered = employes.filter(
            (employe) =>
                (!data.searchTerm ||
                    (employe.user?.name &&
                        employe.user.name
                            .toLowerCase()
                            .includes(data.searchTerm.toLowerCase()))) &&
                (!data.matricule ||
                    (employe.matricule &&
                        employe.matricule
                            .toLowerCase()
                            .includes(data.matricule.toLowerCase()))) &&
                (!data.poste ||
                    (employe.poste &&
                        employe.poste
                            .toLowerCase()
                            .includes(data.poste.toLowerCase()))) &&
                (!data.departement_id ||
                    Number(employe.departement_id) ===
                        Number(data.departement_id)) &&
                (!data.genre || employe.genre === data.genre) &&
                (!data.ville ||
                    (employe.ville &&
                        employe.ville
                            .toLowerCase()
                            .includes(data.ville.toLowerCase()))) &&
                (!data.etat_civil || employe.etat_civil === data.etat_civil)
        );

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(
                (employe) =>
                    employe.date_embauche &&
                    new Date(employe.date_embauche) >= startDate
            );
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(
                (employe) =>
                    employe.date_embauche &&
                    new Date(employe.date_embauche) <= endDate
            );
        }

        if (selectedDepartements.length > 0) {
            filtered = filtered.filter((employe) =>
                selectedDepartements.includes(employe.departement_id)
            );
        }

        setFilteredEmployes(filtered);
        setCurrentPage(1);
    }, [
        data.searchTerm,
        data.matricule,
        data.poste,
        data.departement_id,
        data.start_date,
        data.end_date,
        data.genre,
        data.ville,
        data.etat_civil,
        selectedDepartements,
        employes,
    ]);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEmployes.slice(startIndex, endIndex);
    };

    const handlePageChange = (pageNumber) => {
        if (
            pageNumber >= 1 &&
            pageNumber <= Math.ceil(filteredEmployes.length / itemsPerPage)
        ) {
            setCurrentPage(pageNumber);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSelectEmploye = (employeId) => {
        if (data.employes_ids.includes(employeId)) {
            setData(
                "employes_ids",
                data.employes_ids.filter((id) => id !== employeId)
            );
        } else {
            setData("employes_ids", [...data.employes_ids, employeId]);
        }
    };

    const handleSelectAll = () => {
        const currentPageEmployeIds = getCurrentPageItems().map(
            (employe) => employe.id
        );
        const allSelected = currentPageEmployeIds.every((id) =>
            data.employes_ids.includes(id)
        );

        if (allSelected) {
            setData(
                "employes_ids",
                data.employes_ids.filter(
                    (id) => !currentPageEmployeIds.includes(id)
                )
            );
        } else {
            const newSelectedIds = [...data.employes_ids];
            currentPageEmployeIds.forEach((id) => {
                if (!newSelectedIds.includes(id)) {
                    newSelectedIds.push(id);
                }
            });
            setData("employes_ids", newSelectedIds);
        }
    };

    const handleEmployesDelete = () => {
        if (data.employes_ids.length === 0) {
            toast.error("Veuillez sélectionner au moins un employé.");
            return;
        }

        post(route("employes.bulkDelete"), {
            onSuccess: () => {
                setData("employes_ids", []);
            }
        });
        setShowEmployesDelete(false);
    };

    const handleDeleteClick = (employe) => {
        setEmployeToDelete(employe);
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        if (!employeToDelete) return;
        destroy(`/employes/delete/${employeToDelete.id}`);
        setIsModalOpen(false);
        setEmployeToDelete(null);
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
        setEmployeToDelete(null);
    };

    const employesPerPageOptions = [
        5, 10, 20, 25, 50, 100, 150, 200, 300, 400, 600, 1000,
    ];
    const totalEmployes = filteredEmployes.length;
    const availableOptions = employesPerPageOptions.filter(
        (option) =>
            option <= totalEmployes || option === employesPerPageOptions[0]
    );

    useEffect(() => {
        if (employes) {
            setFilteredEmployes(employes);
        }
    }, [employes]);

    useEffect(() => {
        if (flash.message?.success) {
            toast.success(flash.message.success);
        }
        if (flash.message?.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const genreLabels = {
        homme: "Homme",
        femme: "Femme",
    };

    const etatCivilLabels = {
        celibataire: "Célibataire",
        marie: "Marié(e)",
        divorce: "Divorcé(e)",
        veuf: "Veuf/Veuve",
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR");
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        
        const birth = new Date(birthDate);
        
        if (isNaN(birth.getTime())) {
            console.error('Date de naissance invalide:', birthDate);
            return null;
        }

        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    const hasActiveFilters =
        data.searchTerm ||
        data.matricule ||
        data.poste ||
        data.departement_id ||
        data.start_date ||
        data.end_date ||
        data.genre ||
        data.ville ||
        data.etat_civil ||
        selectedDepartements.length > 0;

    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestion des Employés
                </h2>
            }
        >
            <Head title="Employés" />
            <div className="mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="mr-1 text-lg font-medium text-gray-900">Liste des employés</h3>
                            {width < 550 ? (
                                <div className="flex space-x-3">
                                    {data.employes_ids.length > 0 && (
                                        <button
                                            onClick={() => setShowEmployesDelete(true)}
                                            disabled={data.employes_ids.length === 0}
                                            title={`Supprimer ${data.employes_ids.length} employé${data.employes_ids.length > 1 ? 's' : ''} sélectionné${data.employes_ids.length > 1 ? 's' : ''}`}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                        >
                                            <TiDeleteOutline/>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Ajouter un nouvel employé"
                                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        <BsPersonAdd/>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-3">
                                    {data.employes_ids.length > 0 && (
                                        <button
                                            onClick={() => setShowEmployesDelete(true)}
                                            disabled={data.employes_ids.length === 0}
                                            title={`Supprimer ${data.employes_ids.length} employé${data.employes_ids.length > 1 ? 's' : ''} sélectionné${data.employes_ids.length > 1 ? 's' : ''}`}
                                            className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                        >
                                            <TiDeleteOutline className="mr-1"/>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        title="Ajouter un nouvel employé"
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        <span className="flex justify-center items-center"><BsPersonAdd className="mr-1"/>&nbsp;Ajouter un nouveau employé</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
                            {/* Filtre par nom */}
                            <div className="relative flex-1 min-w-[200px]">
                                <label htmlFor="searchTerm" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par nom:</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="searchTerm"
                                        name="searchTerm"
                                        value={data.searchTerm}
                                        onChange={handleFilterChange}
                                        className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Nom de l'employé..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par matricule */}
                            <div className="relative flex-1 min-w-[200px]">
                                <label htmlFor="matricule" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par matricule:</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="matricule"
                                        name="matricule"
                                        value={data.matricule}
                                        onChange={handleFilterChange}
                                        className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Matricule..."
                                    />
                                </div>
                            </div>

                            {/* Filtre par poste */}
                            <div className="flex-1 min-w-[200px]">
                                <label htmlFor="poste" className="text-xs font-medium text-gray-700 mb-1 block">Poste:</label>
                                <input
                                    type="text"
                                    id="poste"
                                    name="poste"
                                    value={data.poste}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Poste..."
                                />
                            </div>

                            {/* Filtre par département */}
                            <div className="relative flex-1 min-w-[200px] z-20">
                                <MultiSelectDropdown
                                    label="Département :"
                                    options={departements}
                                    selectedOptions={selectedDepartements}
                                    setSelectedOptions={setSelectedDepartements}
                                    optionKey="id"
                                    optionLabel="nom"
                                />
                            </div>

                            {/* Filtre par genre */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="genre" className="text-xs font-medium text-gray-700 mb-1 block">Genre:</label>
                                <select
                                    id="genre"
                                    name="genre"
                                    value={data.genre}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tous</option>
                                    <option value="M">Homme</option>
                                    <option value="F">Femme</option>
                                </select>
                            </div>

                            {/* Filtre par ville */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="ville" className="text-xs font-medium text-gray-700 mb-1 block">Ville:</label>
                                <input
                                    type="text"
                                    id="ville"
                                    name="ville"
                                    value={data.ville}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Ville..."
                                />
                            </div>

                            {/* Filtre par état civil */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="etat_civil" className="text-xs font-medium text-gray-700 mb-1 block">État civil:</label>
                                <select
                                    id="etat_civil"
                                    name="etat_civil"
                                    value={data.etat_civil}
                                    onChange={handleFilterChange}
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Tous</option>
                                    <option value="celibataire">Célibataire</option>
                                    <option value="marie">Marié(e)</option>
                                    <option value="divorce">Divorcé(e)</option>
                                    <option value="veuf">Veuf/Veuve</option>
                                </select>
                            </div>

                            {/* Dates d'embauche */}
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1 block">Embauche début:</label>
                                <input
                                    type="date"
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    id="start_date"
                                    name="start_date"
                                    value={data.start_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1 block">Embauche fin:</label>
                                <input
                                    type="date"
                                    className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    id="end_date"
                                    name="end_date"
                                    value={data.end_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            {/* Éléments par page et bouton réinitialiser */}
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Par page :</label>
                                <div className="flex items-center gap-2">
                                    <select
                                        id="itemsPerPage"
                                        className="w-full h-[30px] px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {availableOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={resetFilters}
                                            title="Réinitialiser les filtres"
                                            className="h-[30px] px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center"
                                        >
                                            <TbZoomReset className="mr-1" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                            <table className="border-collapse table-auto w-full whitespace-nowrap">
                                <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={
                                                    getCurrentPageItems().length > 0 &&
                                                    getCurrentPageItems().every(emp => 
                                                        data.employes_ids.includes(emp.id)
                                                    )
                                                }
                                            />
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Photo
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Informations
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Poste
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Département
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Téléphone
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ville
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            État civil
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date embauche
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((employe) => (
                                            <tr key={employe.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.employes_ids.includes(employe.id)}
                                                        onChange={() => handleSelectEmploye(employe.id)}
                                                    />
                                                </td>
                                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-900">
                                                    {employe.photo ? (
                                                        <img
                                                            src={`/storage/${employe.photo}`}
                                                            alt={employe.user?.name}
                                                            style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '50%' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: '65px',
                                                                height: '65px',
                                                                backgroundColor: '#e5e7eb',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '8px',
                                                                color: '#9ca3af',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            <span className="italic text-gray-400">Aucune photo</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="font-medium">
                                                        {employe.user?.name || <span className="italic text-gray-400">Non défini</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Matricule: {employe.matricule || "N/A"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Genre: {employe.genre === "M" ? "Homme" : "Femme"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Âge: {(() => {
                                                            const age = calculateAge(employe.date_naissance);
                                                            return age !== null ? `${age} ans` : "N/A";
                                                        })()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {employe.poste || <span className="italic text-gray-400">Non défini</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {employe.departement?.name || <span className="italic text-gray-400">Non défini</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {employe.telephone || <span className="italic text-gray-400">N/A</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {employe.email || <span className="italic text-gray-400">Non défini</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {employe.ville || <span className="italic text-gray-400">Non défini</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {employe.etat_civil ? 
                                                        etatCivilLabels[employe.etat_civil] || employe.etat_civil 
                                                        : <span className="italic text-gray-400">N/A</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {employe.date_embauche ? formatDate(employe.date_embauche) : <span className="italic text-gray-400">N/A</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2 justify-center">
                                                        <button
                                                            onClick={() => {
                                                                setShowDetailModal(true);
                                                                setEmployeToShowDetails(employe);
                                                            }}
                                                            title={`Consulter les détails de ${employe.user?.name}`}
                                                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-100"
                                                        >
                                                            <CgDetailsMore/>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setShowEditModal(true);
                                                                setEmployeToEdit(employe);
                                                            }}
                                                            title={`Modifier les informations de ${employe.user?.name}`}
                                                            className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                        >
                                                            <LiaUserEditSolid/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(employe)}
                                                            title={`Supprimer ${employe.user?.name}`}
                                                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                        >
                                                            <TiDeleteOutline/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <span className="italic text-gray-400">Aucun employé trouvé.</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredEmployes.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex justify-end text-sm text-gray-500">
                                    {filteredEmployes.length} employé(s) trouvé(s)
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === 1
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <FaBackward/>
                                    </button>
                                    <span className="px-3 py-1 bg-gray-100 rounded-md">
                                        Page {currentPage} sur {Math.ceil(filteredEmployes.length / itemsPerPage)}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= Math.ceil(filteredEmployes.length / itemsPerPage)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage >= Math.ceil(filteredEmployes.length / itemsPerPage)
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        <TbPlayerTrackNextFilled/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {showDetailModal && (
                        <ModalWrapper 
                            title={`Détails de l'employé ${employeToShowDetails?.user?.name}`}
                            onClose={() => {
                                setShowDetailModal(false);
                                setEmployeToShowDetails(null);
                            }}
                        >
                            {employeToShowDetails && (
                                <DetailsEmploye
                                    employe={employeToShowDetails}
                                    onClose={() => {
                                        setShowDetailModal(false);
                                        setEmployeToShowDetails(null);
                                    }}
                                />
                            )}
                        </ModalWrapper>
                    )}

                    {showAddForm && (
                        <ModalWrapper title="Ajouter un nouveau employé" onClose={() => setShowAddForm(false)}>
                            <AddEmploye 
                                onClose={() => setShowAddForm(false)}
                                departements={departements}
                                users={users}
                                setShowAddForm={setShowAddForm}
                            />
                        </ModalWrapper>
                    )}

                    {showEditModal && (
                        <ModalWrapper 
                            title={`Modifier les informations ${
                                employeToEdit?.user?.role === 'manager' ? 'du responsable RH' : 
                                employeToEdit?.user?.role === 'admin' ? 'de l\'administrateur' :
                                'de l\'employé'
                            } ${employeToEdit?.user?.name}`} 
                            onClose={() => setShowEditModal(false)}
                        >
                            {employeToEdit && (
                                <EditEmploye
                                    employe={employeToEdit}
                                    onClose={() => {
                                        setShowEditModal(false);
                                        setEmployeToEdit(null);
                                    }}
                                    setShowEditForm={setShowEditModal}
                                    departements={departements}
                                    users={users}
                                />
                            )}
                        </ModalWrapper>
                    )}

                    {isModalOpen && (
                        <ConfirmDeleteEmploye
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                            employe={employeToDelete}
                            users={users}
                        />
                    )}

                    {showEmployesDelete && (
                        <ConfirmEmployesDelete
                            employesToDelete={selectedEmployesToDelete}
                            users={users}
                            onConfirm={handleEmployesDelete}
                            onCancel={() => setShowEmployesDelete(false)}
                        />
                    )}
                </div>
            </div>
        </Authenticated>
    );
}

export default IndexEmployes;