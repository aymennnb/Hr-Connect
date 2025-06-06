import React, { useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";

const LoadingSpinner = ({
                            variant = "default",
                            size = "md",
                            text = "Chargement...",
                            isLoading = true,
                            zIndex = 50
                        }) => {
    // Empêcher le défilement du body lorsque le loader est affiché
    useEffect(() => {
        if (isLoading) {
            // Sauvegarde la position de défilement actuelle
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollY}px`;

            return () => {
                // Restaure la position de défilement lors du nettoyage
                document.body.style.position = '';
                document.body.style.width = '';
                document.body.style.top = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isLoading]);

    // Si le composant n'est pas en état de chargement, ne rien afficher
    if (!isLoading) return null;

    // Configuration des tailles
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16"
    };

    // Configuration des variantes
    const variants = {
        default: (
            <div className={`fixed inset-0 z-${zIndex} flex flex-col items-center justify-center`}
                 role="alert"
                 aria-live="assertive">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <Loader2 className={`text-blue-600 animate-spin ${sizeClasses[size]}`} />
                    <p className="mt-4 text-gray-700 font-medium">{text}</p>
                </div>
            </div>
        ),
        minimal: (
            <div className={`fixed inset-0 flex items-center justify-center z-${zIndex}`}
                 role="alert"
                 aria-live="assertive">
                <div className="bg-white/90 p-4 rounded-full shadow-xl">
                    <Loader2 className={`text-blue-600 animate-spin ${sizeClasses[size]}`} />
                </div>
            </div>
        ),
        pulse: (
            <div className={`fixed inset-0 bg-gray-900 bg-opacity-70 z-${zIndex} flex flex-col items-center justify-center`}
                 role="alert"
                 aria-live="assertive">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <div className={`${sizeClasses[size]} relative`}>
                        <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-75 animate-ping"></div>
                        <RefreshCw className="text-blue-600 animate-spin w-full h-full" />
                    </div>
                    <p className="mt-4 text-gray-800 font-medium">{text}</p>
                </div>
            </div>
        )
    };

    return variants[variant] || variants.default;
};

export default LoadingSpinner;
