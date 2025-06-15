import React from "react";

const CongeAutorisation = React.forwardRef(({ conge }, ref) => {
    const dateDebut = new Date(conge.date_debut);
    const dateFin = new Date(conge.date_fin);
    const duree = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
    
    return (
        <div ref={ref} className="p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">AUTORISATION DE CONGÉ</h1>
                <div className="border-t-2 border-b-2 border-gray-400 py-2">
                    <p className="text-sm">Entreprise: [NOM DE L'ENTREPRISE]</p>
                </div>
            </div>
            
            <div className="mb-6">
                <p className="mb-4">Je soussigné(e), [NOM DU RESPONSABLE], autorise par la présente :</p>
                
                <div className="ml-8 mb-4">
                    <p><strong>Nom :</strong> {conge.user?.name}</p>
                    <p><strong>Motif :</strong> {conge.motif}</p>
                    <p><strong>Période :</strong> Du {dateDebut.toLocaleDateString('fr-FR')} au {dateFin.toLocaleDateString('fr-FR')}</p>
                    <p><strong>Durée :</strong> {duree} jour{duree > 1 ? 's' : ''}</p>
                </div>
                
                <p className="mb-4">à s'absenter de son poste de travail pour la durée indiquée ci-dessus.</p>
            </div>
            
            <div className="flex justify-between mt-12">
                <div className="text-center">
                    <p className="mb-8">Fait à [VILLE], le {new Date().toLocaleDateString('fr-FR')}</p>
                    <p className="border-t-2 border-gray-400 pt-2">Signature du responsable</p>
                </div>
                
                <div className="text-center">
                    <p className="mb-8">Cachet et signature de l'entreprise</p>
                    <div className="h-16 border-2 border-gray-400 flex items-center justify-center">
                        <p className="text-gray-500">[LOGO ENTREPRISE]</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-xs text-gray-500 text-center">
                <p>Document généré automatiquement le {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
        </div>
    );
});

export default CongeAutorisation;