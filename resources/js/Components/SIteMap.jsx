import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function SiteMap({ auth, filterSurfaces, filterLocations, selectedSite, oncancel, documents, documentAccess }) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState("info"); // 'info', 'surfaces', 'location', 'documents'
    const carouselRef = useRef(null);

    // Détecte si l'appareil est mobile
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Vérification initiale
        checkScreenSize();

        // Ajouter un écouteur pour les changements de taille d'écran
        window.addEventListener('resize', checkScreenSize);

        // Nettoyer l'écouteur
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const filteredDocuments = documents.filter((doc) => {
        const isSiteMatch = doc.site_id === selectedSite.id;
        const hasAccess = documentAccess.find(
            (access) => access.document_id === doc.id && access.user_id === auth.user.id
        );
        const isAdmin = auth.user.role === "admin";
        return isSiteMatch && (hasAccess || isAdmin);
    });

    useEffect(() => {
        // Sur mobile, montrer les flèches si plus d'un document
        // Sur desktop, montrer les flèches si plus de 2 documents
        setShowArrows(isMobile ? filteredDocuments.length > 1 : filteredDocuments.length > 2);
    }, [filteredDocuments, isMobile]);

    const formatDate = (dateString) => {
        if (!dateString) return "Non disponible";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const scroll = (direction) => {
        const container = carouselRef.current;
        // Ajuster la quantité de défilement en fonction de la taille de l'écran
        const scrollAmount = isMobile ? 200 : 300;

        if (container) {
            if (direction === "left") {
                container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }

            setScrollPosition(container.scrollLeft);
        }
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            setScrollPosition(carouselRef.current.scrollLeft);
        }
    };

    // Types de site avec libellés
    const typeLabels = {
        location: "Loué",
        propre: "Propriété",
    };

    return (
        <div className="flex flex-col bg-white rounded-lg shadow-lg max-w-full mx-auto h-full">
            <div className="p-2 sm:p-4 border-b flex justify-between items-center bg-[#301454] text-orange-500 rounded-t-lg">
                <h3 className="px-3 py-2 font-semibold text-base sm:text-lg truncate max-w-[80%]">
                    {selectedSite.name}
                </h3>
                <button
                    onClick={oncancel}
                    className="text-white hover:text-gray-200 p-1"
                    aria-label="Fermer"
                >
                    <X size={isMobile ? 18 : 20} />
                </button>
            </div>

            {/* Onglets de navigation */}
            <div className="flex border-b">
                <button
                    className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'info' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('info')}
                >
                    Infos générales
                </button>
                {filterSurfaces && (
                    <button
                        className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'surfaces' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('surfaces')}
                    >
                        Surfaces
                    </button>
                )}
                {filterLocations && (
                    <button
                        className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'location' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('location')}
                    >
                        Location
                    </button>
                )}
                <button
                    className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('documents')}
                >
                    Documents
                </button>
            </div>

            <div className="p-4 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto flex-grow">
                {/* Contenu en fonction de l'onglet actif */}
                {activeTab === 'info' && (
                    <>
                        {selectedSite.image && (
                            <img
                                src={`/storage/${selectedSite.image}`}
                                alt={selectedSite.name}
                                className="w-full h-auto object-cover rounded"
                            />
                        )}

                        <div className="space-y-3 text-xs sm:text-sm text-gray-700">
                            <div className="divide-y divide-gray-200">

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Adresse :</p>
                                    {selectedSite.address ? (
                                        <p>{selectedSite.address}</p>
                                    ) : (
                                        <span className="italic text-gray-400">L'adresse n'a pas encore été renseignée pour ce site.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Ville :</p>
                                    {selectedSite.ville ? (
                                        <p>{selectedSite.ville}</p>
                                    ) : (
                                        <span className="italic text-gray-400">La ville associée à ce site est inconnue.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Numéro de téléphone :</p>
                                    {selectedSite.phone ? (
                                        <p>{selectedSite.phone}</p>
                                    ) : (
                                        <span className="italic text-gray-400">Aucun numéro de téléphone disponible pour ce site.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Email :</p>
                                    {selectedSite.email ? (
                                        <p>{selectedSite.email}</p>
                                    ) : (
                                        <span className="italic text-gray-400">Aucune adresse email enregistrée pour ce site.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Site web :</p>
                                    {selectedSite.web ? (
                                        <a
                                            href={selectedSite.web}
                                            className="text-blue-600 hover:underline break-words"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {selectedSite.web.replace(/^https?:\/\//, "")}
                                        </a>
                                    ) : (
                                        <span className="italic text-gray-400">Ce site ne possède pas de site web référencé.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Titre Foncier :</p>
                                    {selectedSite.titre_foncier ? (
                                        <p>{selectedSite.titre_foncier}</p>
                                    ) : (
                                        <span className="italic text-gray-400">Le titre foncier de ce site n'est pas disponible.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Superficie du terrain :</p>
                                    {selectedSite.superficie_terrain ? (
                                        <p>{selectedSite.superficie_terrain} m²</p>
                                    ) : (
                                        <span className="italic text-gray-400">La superficie du terrain n'a pas été renseignée.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Zoning Urbanistique :</p>
                                    {selectedSite.zoning_urbanistique ? (
                                        <p>{selectedSite.zoning_urbanistique}</p>
                                    ) : (
                                        <span className="italic text-gray-400">Les informations de zoning urbanistique sont absentes.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Consistance :</p>
                                    {selectedSite.consistance ? (
                                        <p>{selectedSite.consistance}</p>
                                    ) : (
                                        <span className="italic text-gray-400">La consistance du site n'a pas été spécifiée.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Surface GLA :</p>
                                    {selectedSite.surface_gla ? (
                                        <p>{selectedSite.surface_gla} m²</p>
                                    ) : (
                                        <span className="italic text-gray-400">La surface GLA n'est pas renseignée pour ce site.</span>
                                    )}
                                </div>

                                <div className="py-3">
                                    <p className="font-semibold text-sm sm:text-base">Type de site :</p>
                                    {selectedSite.type_site ? (
                                        <p>{typeLabels[selectedSite.type_site] || selectedSite.type_site}</p>
                                    ) : (
                                        <span className="italic text-gray-400">Le type de site n'a pas été défini.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Onglet Surfaces */}
                {activeTab === 'surfaces' && filterSurfaces && (
                    <>
                        <div className="col-span-full">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Surfaces détaillées</h3>
                        </div>

                        {/* TOTAL */}
                        <div>
                            <p className="text-gray-500 text-sm font-semibold">
                                Total : {filterSurfaces.total ? filterSurfaces.total + " m²" : <span className="italic text-gray-400">Aucun</span>}
                            </p>
                        </div>

                        {/* VN */}
                        <div className="pl-4">
                            <p className="text-gray-500 text-sm font-semibold">
                                VN : {filterSurfaces.vn ? filterSurfaces.vn + " m²" : <span className="italic text-gray-400">Aucun</span>}
                            </p>

                            {/* Sous-niveaux SHOW ROOM */}
                            <div className="pl-4">
                                <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                    Show Room Dacia : <span className="font-medium">{filterSurfaces.show_room_dacia ? filterSurfaces.show_room_dacia + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                </p>

                                <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                    Show Room Renault : <span className="font-medium">{filterSurfaces.show_room_renault ? filterSurfaces.show_room_renault + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                </p>

                                <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                    Show Room Nouvelle Marque : <span className="font-medium">{filterSurfaces.show_room_nouvelle_marque ? filterSurfaces.show_room_nouvelle_marque + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                </p>

                                <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                    Zone de préparation : <span className="font-medium">{filterSurfaces.zone_de_preparation ? filterSurfaces.zone_de_preparation + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                </p>
                            </div>
                        </div>

                        {/* APV */}
                        <div className="pl-4">
                            <p className="text-gray-500 text-sm font-semibold">
                                APV : {filterSurfaces.apv ? filterSurfaces.apv + " m²" : <span className="italic text-gray-400">Aucun</span>}
                            </p>

                            {/* Sous-niveaux APV */}
                            <div className="pl-4">
                                <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                    RMS : <span className="font-medium">{filterSurfaces.rms ? filterSurfaces.rms + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                </p>

                                <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                    Atelier mécanique : <span className="font-medium">{filterSurfaces.atelier_mecanique ? filterSurfaces.atelier_mecanique + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                </p>

                                <p className="text-gray-500 text-sm flex justify-between whitespace-nowrap font-semibold">
                                    Atelier carrosserie : <span className="font-medium">{filterSurfaces.atelier_carrosserie ? filterSurfaces.atelier_carrosserie + " m²" : <span className="italic text-gray-400">Aucun</span>}</span>
                                </p>
                            </div>
                        </div>

                        {/* VO */}
                        <div className="pl-4">
                            <p className="text-gray-500 text-sm font-semibold">
                                VO : {filterSurfaces.vo ? filterSurfaces.vo + " m²" : <span className="italic text-gray-400">Aucun</span>}
                            </p>
                        </div>

                        {/* PARKING */}
                        <div className="pl-4">
                            <p className="text-gray-500 text-sm font-semibold">
                                Parking : {filterSurfaces.parking ? filterSurfaces.parking + " m²" : <span className="italic text-gray-400">Aucun</span>}
                            </p>
                        </div>
                    </>
                )}

                {/* Onglet Location */}
                {activeTab === 'location' && filterLocations && (
                    <div className="space-y-2 text-sm text-gray-700">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Informations de location</h4>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div className="flex flex-col">
                                <span className="font-semibold">Exploitant :</span>
                                <span>{filterLocations.exploitant || "Non disponible"}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-semibold">Bailleur :</span>
                                <span>{filterLocations.bailleur || "Non disponible"}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-semibold">Date d'effet :</span>
                                <span>{filterLocations.date_effet ? formatDate(filterLocations.date_effet) : "Non disponible"}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-semibold">Durée du bail :</span>
                                <span>{filterLocations.duree_bail ? `${filterLocations.duree_bail} ans` : "Non disponible"}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-semibold">Loyer actuel :</span>
                                <span>{filterLocations.loyer_actuel ? `${filterLocations.loyer_actuel} MAD` : "Non disponible"}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-semibold">Taux de révision :</span>
                                <span>{filterLocations.taux_revision ? `${filterLocations.taux_revision} %` : "Non disponible"}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="font-semibold">Prochaine révision :</span>
                                <span>{filterLocations.prochaine_revision ? formatDate(filterLocations.prochaine_revision) : "Non disponible"}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Onglet Documents */}
                {activeTab === 'documents' && (
                    <div className="space-y-6">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Documents liés à ce site</h4>

                        {filteredDocuments.length > 0 ? (
                            <>
                                {/* Définition des types et leurs labels */}
                                {[
                                    { key: 'urbanisme', label: 'Informations Urbanistiques' },
                                    { key: 'contrat', label: 'Contrats' },
                                    { key: 'fiscalite', label: 'Taxes Professionnelles' },
                                    { key: 'autre', label: 'Autres' },
                                ].map(({ key, label }) => {
                                    // Filtrer les documents par type
                                    const docsByType = filteredDocuments.filter(doc => doc.document_type === key);

                                    if (docsByType.length === 0) return null; // Ne pas afficher la section si vide

                                    return (
                                        <div key={key} className="space-y-4">
                                            <h5 className="text-gray-700 font-medium text-sm sm:text-base border-b border-gray-300 pb-1">{label}</h5>

                                            <div className="relative">
                                                {showArrows && scrollPosition > 0 && (
                                                    <button
                                                        onClick={() => scroll("left")}
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 sm:p-1 shadow-md z-10"
                                                        aria-label="Précédent"
                                                    >
                                                        <ChevronLeft size={isMobile ? 18 : 24} className="text-gray-500" />
                                                    </button>
                                                )}

                                                <div
                                                    ref={carouselRef}
                                                    className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-4 py-2 px-1"
                                                    onScroll={handleScroll}
                                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                                >
                                                    {docsByType.map((doc, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex flex-col justify-between flex-shrink-0 w-2/3 sm:w-64 bg-white rounded-2xl shadow-md p-3 sm:p-4 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out"
                                                        >
                                                            <div>
                                                                {/* En-tête avec icône */}
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h5 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
                                                                            {doc.title}
                                                                        </h5>
                                                                    </div>
                                                                </div>

                                                                {/* Description */}
                                                                <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                                                                    {doc.description || "Aucune description disponible."}
                                                                </p>
                                                            </div>

                                                            {/* Bouton Consulter */}
                                                            <a
                                                                href={`/storage/${doc.file_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title={`Ouvrir le document "${doc.title}"`}
                                                                className="mt-3 w-full justify-center inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-600 text-xs sm:text-sm rounded-full hover:bg-blue-200 transition"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Consulter
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>

                                                {showArrows && (
                                                    <button
                                                        onClick={() => scroll("right")}
                                                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 sm:p-1 shadow-md z-10"
                                                        aria-label="Suivant"
                                                    >
                                                        <ChevronRight size={isMobile ? 18 : 24} className="text-gray-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="m-4 sm:m-3">
                                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
                                    <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">Aucun document lié à ce site pour le moment.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
