import { useState, useRef, useEffect } from 'react';

export default function MultiSelectRoles({ selectedRoles, setSelectedRoles, label = "Rôle:" }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Options de rôles prédéfinies
    const roles = [
        { id: 'admin', name: 'Admin' },
        { id: 'manager', name: 'Manager' },
        { id: 'user', name: 'Utilisateur' },
    ];

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(query.toLowerCase())
    );

    const toggleRole = (id) => {
        if (selectedRoles.includes(id)) {
            setSelectedRoles(selectedRoles.filter(item => item !== id));
        } else {
            setSelectedRoles([...selectedRoles, id]);
        }
    };

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Gérer l'affichage des sélections
    const selectedText = selectedRoles.length === 0
        ? "Tous les rôles"
        : `${selectedRoles.length} rôle${selectedRoles.length > 1 ? 's' : ''} sélectionné${selectedRoles.length > 1 ? 's' : ''}`;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="text-xs font-medium text-gray-700 mb-1 block">{label}</label>

            {/* Bouton de sélection */}
            <button
                type="button"
                className="flex justify-between items-center w-full px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate text-gray-700">{selectedText}</span>
                <svg className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {/* Barre de recherche */}
                    <div className="p-2 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Rechercher un rôle..."
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Liste des options */}
                    <div className="max-h-60 overflow-y-auto p-2">
                        {filteredRoles.length > 0 ? (
                            filteredRoles.map((role) => (
                                <label key={role.id} className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role.id)}
                                        onChange={() => toggleRole(role.id)}
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{role.name}</span>
                                </label>
                            ))
                        ) : (
                            <div className="px-2 py-2 text-sm text-gray-500">Aucun rôle trouvé</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
