import React, { useEffect, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import AddUser from "@/Pages/Utilisateurs/AddUser.jsx";
import EditUser from "@/Pages/Utilisateurs/EditUser.jsx";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import ConfirmResetPassword from "@/components/ConfirmResetPassword";
import ConfirmSupprimeUser from "@/components/ConfirmSupprimeUser";
import ChangeRoleConfirm from "@/components/ChangeRoleConfirm";
import ConfirmSuppUsers from "@/Components/ConfirmSuppUsers";
import ConfirmChangeGroupRole from "@/Components/ConfirmChangeGroupRole";
import ModalWrapper from "@/Components/ModalWrapper";
import toast from 'react-hot-toast';
import {FaBackward, FaFileShield} from "react-icons/fa6";
import {TbPlayerTrackNextFilled, TbZoomReset} from "react-icons/tb";
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import { AiOutlineUserDelete } from "react-icons/ai";
import { LiaUserEditSolid } from "react-icons/lia";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdOutlineLockReset } from "react-icons/md";

export default function IndexUsers({ auth,AccessTable, documents,users, flash }) {
    const { data, setData, post, processing, errors, delete: destroy } = useForm({
        users_ids:[],
        user_id: "",
        role: "",
        name_user: "",
        role_group:"",
        searchTerm:"",
        searchId:"",
        searchEmail:"",
        filterRole:"",
        start_date: "",
        end_date: ""
    });

    const width = useWindowWidth();

    // La partie des Access
    const [showDocsAccessModal, setShowDocsAccessModal] = useState(false);
    const [currentUserDocuments, setCurrentUserDocuments] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [userToReset, setUserToReset] = useState(null);
    const [showConfirmChangeRole, setShowConfirmChangeRole] = useState(false);
    const [userToChangeRole, setUserToChangeRole] = useState(null);
    const [confirmedChange, setConfirmedChange] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const [UsersToDelete,setUsersToDelete] = useState([]);
    const [showConfirmGroupModal, setShowConfirmGroupModal] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [usersToChange, setUsersToChange] = useState([]);

    // Ajout pour la pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [UserAccess, setUserAccess] = useState(null);

    // Fonction pour réinitialiser tous les filtres
    const resetFilters = () => {
        setData({
            ...data,
            searchTerm: '',
            searchId: '',
            searchEmail: '',
            filterRole: '',
            start_date: '',
            end_date: ''
        });
        setCurrentPage(1);
    };



    useEffect(() => {
        if (!users) return;

        let filtered = users.filter(user =>
            user.id !== auth.user.id && user.name && user.name.toLowerCase().includes(data.searchTerm.toLowerCase())
        );

        if (data.searchId) {
            filtered = filtered.filter(user =>
                user.id.toString().includes(data.searchId)
            );
        }

        if (data.searchEmail) {
            filtered = filtered.filter(user =>
                user.email && user.email.toLowerCase().includes(data.searchEmail.toLowerCase())
            );
        }

        if (data.filterRole) {
            filtered = filtered.filter(user =>
                user.role === data.filterRole
            );
        }

        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(user => new Date(user.created_at) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(user => new Date(user.created_at) <= endDate);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [data.searchTerm, data.searchId, data.searchEmail, data.filterRole, data.start_date, data.end_date, users, auth.user.id]);

    useEffect(() => {
        if (users) {
            setFilteredUsers(users.filter(user => user.id !== auth.user.id && user.role !== "superadmin"));
        }
    }, [users, auth.user.id]);

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredUsers.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    // Gestionnaire pour le champ de recherche et les filtres de date
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Options pour le nombre d'éléments par page
    const usersPerPageOptions = [5, 10, 20, 25, 50, 100, 150, 200, 300, 400, 600, 1000];
    const totalUsers = filteredUsers.length;
    const availableOptions = usersPerPageOptions.filter(option => option <= totalUsers || option === usersPerPageOptions[0]);

    const openEditUser = (user) => {
        setUserToEdit(user);
        setShowEditForm(true);
    };

    const handleRoleChange = (userId, userName, currentRole, newRole) => {
        setUserToChangeRole({
            id: userId,
            userName: userName,
            LastRole: currentRole,
            newRole: newRole,
        });
        setShowConfirmChangeRole(true);
    };

    const confirmChangeRole = () => {
        if (userToChangeRole) {
            setData(prev => ({
                ...prev,
                user_id: userToChangeRole.id,
                role: userToChangeRole.newRole,
            }));
            setConfirmedChange(true);
            setShowConfirmChangeRole(false);
        }
    };

    useEffect(() => {
        if (confirmedChange && data.user_id && data.role) {
            post(route("users.updateRole"), {
                onSuccess: () => {
                    setShowConfirmChangeRole(false);
                    setUserToChangeRole(null);
                    setData(prevData => ({
                        ...prevData,
                        user_id: "",
                        role: "",
                    }));
                    setConfirmedChange(false);
                },
                onError: (errors) => {
                    console.error("Erreur modification rôle :", errors);
                    const message = errors?.message || "Erreur lors de la modification du rôle.";
                    toast.error(message);
                    setConfirmedChange(false);
                }
            });
        }
    }, [confirmedChange, data.user_id, data.role]);


    const cancelChangeRole = () => {
        setShowConfirmChangeRole(false);
        setUserToChangeRole(null);
    };

    const handleSelectUser = (documentId) => {
        if (data.users_ids.includes(documentId)) {
            setData("users_ids", data.users_ids.filter((id) => id !== documentId));
        } else {
            setData("users_ids", [...data.users_ids, documentId]);
        }
    };

    const openResetPasswordConfirmation = (userId, userName) => {
        setUserToReset({ id: userId, name: userName });
        setShowConfirmReset(true); // Met à jour l'état pour afficher le modal
    };

    const handleUsersDelete = () => {
        const selectedusers = users
            .filter((user) => data.users_ids.includes(user.id))
            .map((user) => ({ id: user.id, name: user.name, role: user.role }));

        if (auth.user.role === "admin") {
            const hasAdminInSelection = selectedusers.some((user) => user.role === "admin");

            if (hasAdminInSelection) {
                toast.error("Vous ne pouvez pas supprimer un admin.");
                return;
            }
        }

        setUsersToDelete(selectedusers);
        setShowConfirmGroupModal(true);
    };

    const confirmUsersGroupDelete = () => {
        post(route("utilisateurs.UsersDelete"), {
            onSuccess: () => {
                setData("users_ids", []);
            },
        });
        setShowConfirmGroupModal(false);
    };

    const cancelGroupDelete = () => {
        setShowConfirmGroupModal(false);
    };

    const resetPassword = () => {
        post(route('users.resetPassword', userToReset.id), {
            preserveScroll: true,
        });
        setShowConfirmReset(false);
    };

    const askResetPassword = (userId, userName) => {
        setUserToReset({ id: userId, name: userName });
        setShowConfirmReset(true);
    };

    const deleteUser = (userId, userRole, userName) => {
        setUserToDelete({ id: userId, role: userRole, name_user_to_delete: userName });
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {

        if (!userToDelete) return;

        const accessEntries = AccessTable.filter((entry) => entry.user_id === userToDelete.id);

        if (accessEntries.length > 0) {
            const User = users.find((user) => user.id === userToDelete.id);
            const UserName = User.name;

            const documentNames = accessEntries.map((entry) => {
                const doc = documents.find((document) => document.id === entry.document_id);
                return doc ? doc.title : "Document inconnu";
            });

            const maxDocuments = 5;
            const displayedDocuments = documentNames.slice(0, maxDocuments);
            const remainingDocuments = documentNames.length - maxDocuments > 0;

            const documentList = displayedDocuments.map((doc, index) => `• ${doc}`).join('\n');
            const additionalMessage = remainingDocuments ? "\n...\n" : "";

            toast.error(
                `L'utilisateur ${UserName} a ${accessEntries.length} document${accessEntries.length > 1 ? "s" : ""} auquel il a accès, ${accessEntries.length > 1 ? "ces documents" : "cet document"} : \n\n${documentList}${additionalMessage}\n\nVeuillez supprimer ces accès avant de pouvoir supprimer cet utilisateur.`,
                {
                    duration: 10000,
                }
            );

            setShowConfirmDelete(false);
            return;
        }

        destroy(`/utilisateurs/delete/${userToDelete.id}`);
        setShowConfirmDelete(false);
        setUserToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirmDelete(false);
        setUserToDelete(null);
    };

    const handleUsersRoleChange = (e) => {
        const role = e.target.value;
        if (!role) {
            toast.error('Veuillez choisir un rôle avant de continuer.');
            return;
        }
        setData('role_group', role);
        const selectedUsers = users.filter((u) => data.users_ids.includes(u.id));
        setUsersToChange(selectedUsers);
        setShowConfirmModal(true);
    };

    const confirmRoleChange = () => {
        post(route('utilisateurs.changeGroupRole'), {
            onSuccess: () => {
                setData(prevData => ({
                    ...prevData,
                    users_ids: []
                }));
            },
            onError: () => {
                toast.error("Une erreur est survenue lors de la modification du rôle.");
            }
        });
        setShowConfirmModal(false);
    };

    useEffect(() => {
        if (flash.message && flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message && flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);


    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Utilisateurs</h2>}>
            <Head title="Utilisateurs" />
            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="mr-1 text-lg font-medium text-gray-900">
                                    Liste des utilisateurs
                                </h3>
                                {width < 550 ?
                                    <div className="flex space-x-3">
                                        {data.users_ids.length > 0 && (
                                            <>
                                                <button
                                                    onClick={handleUsersDelete}
                                                    disabled={data.users_ids.length === 0}
                                                    title={`Supprimer ${data.users_ids.length} utilisateur${data.users_ids.length > 1 ? 's' : ''} sélectionné${data.users_ids.length > 1 ? 's' : ''}`}
                                                    className="px-2 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                                >
                                                    <AiOutlineUsergroupDelete />{/*Supprimer*/}
                                                </button>
                                                <select
                                                    style={{ height: "36px" }}
                                                    className="px-2 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    onChange={handleUsersRoleChange}
                                                >
                                                    <option value="">Rôle</option>
                                                    {auth.user.role === "superadmin" && (
                                                        <option value="admin">Admin</option>
                                                    )}
                                                    {(auth.user.role === "superadmin" || auth.user.role === "admin") && (
                                                        <>
                                                            <option value="manager">Responsable RH</option>
                                                            <option value="user">Employé</option>
                                                        </>
                                                    )}
                                                </select>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setShowAddForm(true)}
                                            title="Ajouter un nouveau utilisateur"
                                            className="px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                        >
                                            <IoPersonAddOutline />{/*Ajouter un utilisateur*/}
                                        </button>
                                    </div> :
                                    <div className="flex space-x-3">
                                            {data.users_ids.length > 0 && (
                                                <>
                                                    <button
                                                        onClick={handleUsersDelete}
                                                        disabled={data.users_ids.length === 0}
                                                        title={`Supprimer ${data.users_ids.length} utilisateur${data.users_ids.length > 1 ? 's' : ''} sélectionné${data.users_ids.length > 1 ? 's' : ''}`}
                                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                                    >
                                                        <AiOutlineUsergroupDelete/> {/*Supprimer*/}
                                                    </button>
                                                    <select
                                                        style={{ height: "30px" }}
                                                        className="block w-48 px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        onChange={handleUsersRoleChange}
                                                    >
                                                        <option value="">-- Changer le role --</option>
                                                        {auth.user.role === "superadmin" && (
                                                            <option value="admin">Admin</option>
                                                        )}
                                                        {(auth.user.role === "superadmin" || auth.user.role === "admin") && (
                                                            <>
                                                                <option value="manager">Responsable RH</option>
                                                                <option value="user">Employé</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </>
                                            )}
                                            <button
                                                onClick={() => setShowAddForm(true)}
                                                title="Ajouter un nouveau utilisateur"
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                            >
                                                <IoPersonAddOutline/>{/*Ajouter un utilisateur*/}
                                            </button>
                                        </div>
                                }
                            </div>

                            <div className="flex flex-wrap items-end gap-3 mb-7 relative z-0">
                                {/* Filtre par ID */}
                                <div className="relative flex-1 min-w-[150px]">
                                    <label htmlFor="searchId" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par ID:</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="number"
                                            id="searchId"
                                            name="searchId"
                                            value={data.searchId}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="ID..."
                                        />
                                    </div>
                                </div>

                                {/* Filtre par nom */}
                                <div className="relative flex-1 min-w-[200px]">
                                    <label htmlFor="searchTerm" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par nom:</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            id="searchTerm"
                                            name="searchTerm"
                                            value={data.searchTerm}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Nom..."
                                        />
                                    </div>
                                </div>

                                {/* Filtre par adresse email */}
                                <div className="relative flex-1 min-w-[200px]">
                                    <label htmlFor="searchEmail" className="text-xs font-medium text-gray-700 mb-1 block">Recherche par email:</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            id="searchEmail"
                                            name="searchEmail"
                                            value={data.searchEmail}
                                            onChange={handleFilterChange}
                                            className="block w-full pl-10 pr-3 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Email..."
                                        />
                                    </div>
                                </div>

                                {/* Filtre par rôle */}
                                <div className="relative flex-1 min-w-[150px]">
                                    <label htmlFor="filterRole" className="text-xs font-medium text-gray-700 mb-1 block">Filtrer par rôle:</label>
                                    <select
                                        id="filterRole"
                                        name="filterRole"
                                        value={data.filterRole}
                                        onChange={handleFilterChange}
                                        className="block w-full px-3 py-1 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Tous les rôles</option>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Responsable RH</option>
                                        <option value="user">Employé</option>
                                    </select>
                                </div>

                                {/* Dates de création */}
                                <div className="flex-1 min-w-[150px]">
                                    <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1 block">Création début:</label>
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
                                    <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1 block">Création fin:</label>
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
                                                setCurrentPage(1); // Réinitialiser à la première page
                                            }}
                                        >
                                            {availableOptions.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={resetFilters}
                                            title="Réinitialiser le Filtre"
                                            className="h-[30px] px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center"
                                        >
                                            <TbZoomReset className="mr-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                <table className="border-collapse table-auto w-full whitespace-nowrap">
                                    <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Email Vérifié</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Création</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Mise à jour</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {auth.user.role === "superadmin" || (auth.user.role === "admin" && user.role !== "admin") ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={data.users_ids.includes(user.id)}
                                                            onChange={() => handleSelectUser(user.id)}
                                                        />
                                                    ) : null}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {user.id ?? <span className="italic text-gray-400">Identifiant non disponible</span>}
                                                </td>

                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {user.name ?? <span className="italic text-gray-400">Nom non renseigné</span>}
                                                </td>

                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {user.email ?? <span className="italic text-gray-400">Email non renseigné</span>}
                                                </td>
                                                <td className="px-6 whitespace-nowrap text-sm text-gray-500">
                                                    <select
                                                        className="border border-gray-300 rounded-[7px] py-1"
                                                        defaultValue={user.role}
                                                        onChange={(e) => handleRoleChange(
                                                            user.id,
                                                            user.name,
                                                            user.role,
                                                            e.target.value
                                                        )}
                                                        title={
                                                            user.role === "admin"
                                                                ? `Changement du rôle de l'admin ${user.name} non autorisée`
                                                                : `Changer le rôle ${user.role === "manager" ? "du manager" : "de l'utilisateur"} ${user.name}`
                                                        }
                                                        disabled={(user.role === "admin" && auth.user.role === "admin")}
                                                    >
                                                        {auth.user.role === "superadmin" ?
                                                            <>
                                                                <option value="admin">Admin</option>
                                                                <option value="manager">Responsable RH</option>
                                                                <option value="user">Employé</option>
                                                            </>
                                                            : auth.user.role === "admin" ? (
                                                            user.role === "admin" ? (
                                                                <>
                                                                    <option value="admin">Admin</option>
                                                                    <option value="manager">Responsable RH</option>
                                                                    <option value="user">Employé</option>
                                                                </>
                                                            ) : (
                                                            <>
                                                                <option value="manager">Responsable RH</option>
                                                                <option value="user">Employé</option>
                                                            </>
                                                            )
                                                            ) : null
                                                        }
                                                    </select>
                                                    {errors.role && (
                                                        <div className="text-red-500 text-xs mt-1">{errors.role}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{user.email_verified_at ? "Oui" : "Non"}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {user.created_at
                                                        ? new Date(user.created_at).toLocaleString("fr-FR")
                                                        : <span className="italic text-gray-400">Date de création inconnue</span>}
                                                </td>

                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {user.updated_at
                                                        ? new Date(user.updated_at).toLocaleString("fr-FR")
                                                        : <span className="italic text-gray-400">Date de mise à jour inconnue</span>}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2 justify-center">
                                                        <button
                                                               onClick={() => openEditUser(user)}
                                                               className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                               title={
                                                                   user.role === "admin"
                                                                       ? `Modification des informations pour l'admin ${user.name} non autorisée`
                                                                       : `Modifier les informations de ${user.name}`
                                                               }
                                                               disabled={(user.role === "admin" && auth.user.role === "admin")}
                                                               >
                                                               <LiaUserEditSolid/>{/*Modifier*/}
                                                        </button>
                                                        <button
                                                               onClick={() => deleteUser(user.id, user.role, user.name)}
                                                               className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                               title={
                                                                   user.role === "admin"
                                                                       ? `Suppression de l'admin ${user.name} non autorisée`
                                                                       : `Supprimer l'utilisateur ${user.name}`
                                                               }
                                                               disabled={(user.role === "admin" && auth.user.role === "admin")}
                                                               >
                                                               <AiOutlineUserDelete/>{/*Supprimer*/}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                                <span className="italic text-gray-400">Aucun utilisateur trouvé.</span>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredUsers.length > 0 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex justify-end text-sm text-gray-500">
                                        {filteredUsers.length} utilisateur(s) trouvé(s)
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
                                            Page {currentPage} sur {Math.ceil(filteredUsers.length / itemsPerPage)}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)
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
                    </div>
                </div>
            </div>
            {showEditForm && userToEdit && (
                <ModalWrapper title={`Modifier les information de l'utilisateur ${userToEdit.name}`} onClose={() => setShowEditForm(false)}>
                    <EditUser auth={auth} user={userToEdit} setShowEditForm={setShowEditForm} showEditForm={showEditForm}/>
                </ModalWrapper>
            )}
            {showAddForm && (
                <ModalWrapper
                    title="Ajouter un nouveau utilisateur"
                    onClose={() => setShowAddForm(false)}
                >
                    <AddUser auth={auth} setShowAddForm={setShowAddForm} />
                </ModalWrapper>
            )}
            {showConfirmChangeRole && (
                <ChangeRoleConfirm
                    UserToChangeRole={userToChangeRole}
                    confirmChangeRole={confirmChangeRole}
                    cancelChangeRole={cancelChangeRole}
                />
            )}
            {showConfirmReset && (
                <ConfirmResetPassword
                    userToReset={userToReset}
                    onConfirm={resetPassword}
                    onCancel={() => setShowConfirmReset(false)}
                />
            )}
            {showConfirmDelete && (
                <ConfirmSupprimeUser
                    userToDelete={userToDelete}
                    confirmDelete={confirmDelete}
                    cancelDelete={cancelDelete}
                />
            )}
            {showConfirmGroupModal && (
                <ConfirmSuppUsers
                    UsersToDelete={UsersToDelete}
                    onConfirm={confirmUsersGroupDelete}
                    onCancel={cancelGroupDelete}
                />
            )}
            {showConfirmModal && (
                <ConfirmChangeGroupRole
                    usersToChange={usersToChange}
                    newRole={data.role_group}
                    onConfirm={confirmRoleChange}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </Authenticated>
    );
}
