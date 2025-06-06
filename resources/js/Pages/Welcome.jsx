import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Users, BarChart2, Shield, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CgLogIn } from "react-icons/cg";
import { RiUserAddLine } from "react-icons/ri";
import {useWindowWidth} from "@/hooks/useWindowWidth.js";

export default function Welcome({ auth }) {
    const [activeTab, setActiveTab] = useState('analytics'); // Changé pour 'analytics' par défaut

    const width = useWindowWidth();
    const isMobile = width < 875;

    // Palette de couleurs optimisée
    const colors = {
        primary: '#2563eb',      // Bleu professionnel
        secondary: '#4f46e5',   // Indigo
        accent: '#10b981',      // Vert émeraude
        dark: '#1e293b',        // Bleu foncé
        light: '#f8fafc'        // Blanc cassé
    };

    // Fonctionnalités réelles seulement
    const features = [
    'Tableau de bord des informations RH globales',
    'Gestion complète des employés et départements',
    'Suivi et validation des demandes de congés',
    'Gestion des salaires et des utilisateurs avec journalisation'
    ];

    const advantages = [
        'Interface intuitive et moderne',
        'Sécurité des données certifiée',
        'Synchronisation avec les outils métiers',
        'Support technique dédié'
    ];

    return (
        <>
            <Head title="HR-Connect - Gestion des Ressources Humaines" />
            <div className="bg-gray-50 min-h-screen flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className={isMobile ? "text-xl font-bold" : "text-2xl font-bold"}>
                            <span style={{ color: colors.primary }}>HR</span>
                            <span style={{ color: colors.accent }}>-Connect</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth ? (
                                <Link
                                    href={route('dashboard')}
                                    style={{ backgroundColor: colors.primary }}
                                    className="rounded-md px-4 py-2 text-white hover:bg-blue-600 transition-colors"
                                >
                                    Tableau de bord
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        style={{ color: colors.primary, borderColor: colors.primary }}
                                        className="rounded-md px-4 py-2 border hover:bg-blue-50 transition-colors"
                                    >
                                        {isMobile ? <CgLogIn/> : "Connexion" }
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        style={{ backgroundColor: colors.primary }}
                                        className="rounded-md px-4 py-2 text-white hover:bg-blue-600 transition-colors"
                                    >
                                        {isMobile ? <RiUserAddLine/> : "Inscription" }
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Optimisez votre <span style={{ color: colors.primary }}>Gestion RH</span> avec <span style={{ color: colors.primary }}>HR</span><span style={{ color: colors.accent }}>-Connect</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            La solution tout-en-un pour digitaliser et simplifier la gestion de vos ressources humaines.
                        </p>
                    </motion.div>

                    {/* Tabs - Style amélioré */}
                    <div className="flex justify-center mb-8">
                        <div className="w-full max-w-md grid grid-cols-2 rounded-md shadow-sm overflow-hidden border" style={{ borderColor: colors.primary }}>
                            {['analytics', 'features'].map((tab) => ( // Ordre inversé pour avoir Analytique à gauche
                                <button
                                    key={tab}
                                    type="button"
                                    style={{
                                        backgroundColor: activeTab === tab ? colors.primary : 'white',
                                        color: activeTab === tab ? 'white' : colors.dark
                                    }}
                                    className="w-full px-5 py-2 text-sm font-medium text-center transition-colors duration-200"
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'features' ? 'Fonctionnalités' : 'Analytique'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content - Contenu inversé */}
                    {activeTab === 'features' ? (
                        <motion.div
                            className="bg-white rounded-lg shadow-md p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Fonctionnalités principales */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>
                                        <Users className="inline mr-2" size={20} />
                                        Fonctionnalités clés
                                    </h3>
                                    <ul className="space-y-3">
                                        {features.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <div 
                                                    className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-white mr-3"
                                                    style={{ backgroundColor: colors.primary }}
                                                >
                                                    <span className="text-sm font-medium">{index + 1}</span>
                                                </div>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Avantages */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4" style={{ color: colors.accent }}>
                                        <Shield className="inline mr-2" size={20} />
                                        Avantages
                                    </h3>
                                    <ul className="space-y-3">
                                        {advantages.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <div 
                                                    className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-white mr-3"
                                                    style={{ backgroundColor: colors.accent }}
                                                >
                                                    <span className="text-sm font-medium">✓</span>
                                                </div>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-8 text-center">
                                <Link
                                    href={route('register')}
                                    style={{ backgroundColor: colors.primary }}
                                    className="inline-flex items-center px-6 py-3 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Commencer maintenant
                                    <ArrowRight size={16} className="ml-2" />
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                                <div className="flex items-center justify-center text-center mb-4">
                                    <BarChart2 size={40} style={{ color: colors.secondary }} className="mr-3" />
                                    <h3 className="text-xl font-semibold" style={{ color: colors.dark }}>
                                        Tableaux de bord analytiques
                                    </h3>
                                </div>
                                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center p-4">
                                        <p className="text-gray-600 mb-4">
                                            Visualisez les indicateurs clés de votre gestion RH
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['Effectifs', 'Départements', 'Congés', 'Paie'].map((item, index) => (
                                                <div 
                                                    key={index} 
                                                    className="p-3 rounded-lg text-white font-medium"
                                                    style={{ 
                                                        backgroundColor: 
                                                            index % 3 === 0 ? colors.primary : 
                                                            index % 3 === 1 ? colors.secondary : colors.accent
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold">
                                <span style={{ color: colors.primary }}>HR</span>
                                <span style={{ color: colors.accent }}>-Connect</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Votre partenaire en gestion des ressources humaines</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            © {new Date().getFullYear()} HR-Connect, Tous droits réservés.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}