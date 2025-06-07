import { useState, useRef, useEffect } from 'react';

export default function MultiSelectDropdown({ options, selectedOptions, setSelectedOptions, label}) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredOptions = query.trim() === ''
        ? options
        : options.filter(option => option.name.toLowerCase().includes(query.toLowerCase()));

    const toggleOption = (id) => {
        if (selectedOptions.includes(id)) {
            setSelectedOptions(selectedOptions.filter(item => item !== id));
        } else {
            setSelectedOptions([...selectedOptions, id]);
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

    // Gérer les sélections
    const selectedText = selectedOptions.length === 0
        ? "Sélectionner..."
        : `${selectedOptions.length} sélectionné${selectedOptions.length > 1 ? 's' : ''}`;

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
                <div className="absolute z-50 w-full mt-1 border border-gray-300 rounded-md shadow-lg bg-white">
                    {/* Barre de recherche */}
                    <div className="p-2 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Recherche ..."
                            className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Liste des options - toujours afficher avec hauteur minimale */}
                    <div className="min-h-[100px] max-h-60 overflow-y-auto p-2 bg-white">
                        {options.map((option) => {
                            // Si l'option correspond à la recherche ou si la recherche est vide
                            const isVisible = query.trim() === '' ||
                                option.name.toLowerCase().includes(query.toLowerCase());

                            return (
                                <label
                                    key={option.id}
                                    className={`flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer ${!isVisible ? 'hidden' : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedOptions.includes(option.id)}
                                        onChange={() => toggleOption(option.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                                </label>
                            );
                        })}

                        {/* Message quand aucun résultat ne correspond */}
                        {filteredOptions.length === 0 && (
                            <div className="px-2 py-2 text-sm text-gray-500">
                                <span className="italic text-gray-400">Aucun résultat trouvé</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
