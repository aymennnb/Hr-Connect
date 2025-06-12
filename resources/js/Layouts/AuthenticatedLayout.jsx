import React, { useState, useEffect, useRef } from "react";
import NavLink from "@/Components/NavLink";
import { Link } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "@/Components/Loader";
import { FaRegCalendarAlt, FaSuitcase } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import {useWindowWidth} from "@/hooks/useWindowWidth.js";
import { FaMoneyBillWave } from "react-icons/fa6";
import { FaUsersLine } from "react-icons/fa6";
import { TbContract } from "react-icons/tb";


export default function Authenticated({ user, header, children }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const stored = localStorage.getItem("sidebarOpen");
        return stored !== null ? stored === "true" : true;
    });
    const dropdownRef = useRef();
    const [loading, setLoading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const Width = useWindowWidth();
    const isMobile = Width < 768;

    // Palette de couleurs HR-Connect
    const colors = {
        primary: '#2563eb',      // Bleu professionnel
        secondary: '#4f46e5',   // Indigo
        accent: '#10b981',      // Vert émeraude
        dark: '#1e293b',        // Bleu foncé
        light: '#f8fafc'        // Blanc cassé
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const start = () => setLoading(true);
        const finish = () => {
            setTimeout(() => {
                setLoading(false);
            }, 50);
        };

        document.addEventListener('inertia:start', start);
        document.addEventListener('inertia:finish', finish);
        document.addEventListener('inertia:error', finish);
        document.addEventListener('inertia:cancel', finish);

        return () => {
            document.removeEventListener('inertia:start', start);
            document.removeEventListener('inertia:finish', finish);
            document.removeEventListener('inertia:error', finish);
            document.removeEventListener('inertia:cancel', finish);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => {
            localStorage.setItem("sidebarOpen", !prev);
            return !prev;
        });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const isExemptPage = window.location.pathname === '/dashboard';

    const getWelcomeMessage = (name, role) => {
        switch (role.toLowerCase()) {
            case "admin":
                return `Bienvenue, cher administrateur ${name}`;
            case "manager":
                return `Bienvenue, cher responsable RH ${name}`;
            case "superadmin":
                return `Bienvenue, fondateur ${name}`;
            case "user":
            default:
                return `Bienvenue, ${name}`;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-sm text-gray-800">
            {!isExemptPage && <LoadingSpinner isLoading={loading} size="sm" />}
            
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-md flex flex-col overflow-hidden`}>
                <div className="text-center text-2xl font-bold py-6 border-b border-gray-200 whitespace-nowrap">
                    <span style={{ color: colors.primary }}>HR</span>
                    <span style={{ color: colors.accent }}>-Connect</span>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2 whitespace-nowrap">
                    {/* Menu commun à tous les utilisateurs */}
                    <NavLink href={route("dashboard")} active={route().current("dashboard")}>
                        {user.role === "user" ? 
                        <div className="flex text-blue-600 items-center gap-2">
                            <FaRegCalendarAlt style={{ color: colors.primary }} />
                            <span>Espace Personnel</span>
                        </div>
                        : 
                        <div className="flex text-blue-600 items-center gap-2">
                            <MdSpaceDashboard style={{ color: colors.primary }} />
                            <span>Tableau de bord</span>
                        </div>
                        }
                    </NavLink>
                    {user.role !== "user" && (
                    <NavLink href={route("espace.personal")} active={route().current("espace.personal")}>
                            <div className="flex text-blue-600 items-center gap-2">
                                <FaRegCalendarAlt style={{ color: colors.primary }} />
                                <span>Espace Personnel</span>
                            </div>
                    </NavLink>
                    )}
                    <NavLink href={route("conges.public")} active={route().current("conges.public")} >
                            <div className="flex text-blue-600 items-center gap-2">
                                <FaRegCalendarAlt style={{ color: colors.primary }} />
                                <span>Mes congés</span>
                            </div>
                    </NavLink>
                    <NavLink href={route("dashboard")} >
                            <div className="flex text-blue-600 items-center gap-2">
                                <FaRegCalendarAlt style={{ color: colors.primary }} />
                                <span>Mes salaires</span>
                            </div>
                    </NavLink>

                    {/* Menu pour admin/manager/superadmin */}
                    {(user.role === "admin" || user.role === "manager" || user.role === "superadmin") && (
                        <>
                            <NavLink href={route("employes")} active={route().current("employes")}>
                                <div className="flex text-blue-600 items-center gap-2">
                                    <FaUsersLine style={{ color: colors.primary }} />
                                    <span>Employés</span>
                                </div>
                            </NavLink>
                            
                            <NavLink href={route("departements")} active={route().current("departements")}>
                                <div className="flex text-blue-600 items-center gap-2">
                                    <FaSuitcase style={{ color: colors.primary }} />
                                    <span>Départements</span>
                                </div>
                            </NavLink>
                            
                            <NavLink href={route("contrats")} active={route().current("contrats")}>
                                <div className="flex text-blue-600 items-center gap-2">
                                    <TbContract style={{ color: colors.primary }} />
                                    <span>Contrats</span>
                                </div>
                            </NavLink>
                            
                            <NavLink href={route("conges")} active={route().current("conges")}>
                                <div className="flex text-blue-600 items-center gap-2">
                                    <FaRegCalendarAlt style={{ color: colors.primary }} />
                                    <span>Congés</span>
                                </div>
                            </NavLink>
                            
                            <NavLink href={route("salaires")} active={route().current("salaires")}>
                                <div className="text-blue-600 flex items-center gap-2">
                                    <FaMoneyBillWave style={{ color: colors.primary }} />
                                    <span>Salaires</span>
                                </div>
                            </NavLink>
                        </>
                    )}

                    {/* Menu spécifique pour admin/superadmin */}
                    {(user.role === "admin" || user.role === "superadmin") && (
                        <>
                            <NavLink href={route("utilisateurs")} active={route().current("utilisateurs")}>
                                <div className="flex text-blue-600 items-center gap-2">
                                    <FaUsers style={{ color: colors.primary }} />
                                    <span>Utilisateurs</span>
                                </div>
                            </NavLink>
                            
                            <NavLink href={route("alerts")} active={route().current("alerts")}>
                                <div className="flex text-blue-600 items-center gap-2">
                                    <FaRegNewspaper style={{ color: colors.primary }} />
                                    <span>Journaux</span>
                                </div>
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* User dropdown */}
                <div ref={dropdownRef} className="p-4 border-t border-gray-200 relative">
                    <span className="text-xs text-gray-500">Connecté en tant que</span>

                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="text-sm font-semibold cursor-pointer hover:text-blue-600 transition flex items-center justify-between mt-1"
                    >
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-sm"
                                style={{ backgroundColor: colors.primary }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.name}</span>
                        </div>

                        <svg
                            className={`w-4 h-4 ml-2 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {showDropdown && (
                        <div className="p-2 absolute bottom-16 left-4 w-5/6 bg-white border border-gray-200 rounded shadow-lg z-50">
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center gap-2 w-full px-4 py-2 rounded hover:bg-[#10b975] transition"
                                style={{ color: colors.primary }}
                            >
                                <FaUser />
                                <span>Profil</span>
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center gap-2 w-full mt-1 px-4 py-2 rounded hover:bg-[#10b975] transition"
                                style={{ color: colors.primary }}
                            >
                                <FaSignOutAlt />
                                <span>Déconnexion</span>
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Toaster position="top-right" reverseOrder={false} toastOptions={{
                    autoClose: 7000,
                    pauseOnHover: true,
                    draggable: true,
                    pauseOnFocusLoss: true,
                }} />
                
                <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded hover:bg-gray-100 transition-colors focus:outline-none"
                            aria-label={isSidebarOpen ? "Masquer la barre latérale" : "Afficher la barre latérale"}
                        >
                            {isSidebarOpen ? "☰" : "☲"}
                        </button>
                        
                        {!isMobile && (
                            <button
                                onClick={toggleFullscreen}
                                className="p-2 rounded hover:bg-gray-100 transition-colors focus:outline-none"
                                title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                            >
                                {isFullscreen ? (
                                    <MdFullscreenExit className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <MdFullscreen className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                        )}
                        
                        <h2 className="text-lg font-semibold text-gray-700">{header}</h2>
                    </div>

                    <div className="flex items-start md:items-center gap-3">
                        <h2 className="text-base md:text-lg font-medium" style={{ color: colors.dark }}>
                            {getWelcomeMessage(user.name, user.role)}
                        </h2>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
            </div>
        </div>
    );
}