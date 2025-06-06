import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import '../../css/NotFound.css'
import {useEffect} from "react"
import {Head} from "@inertiajs/react";
import toast from 'react-hot-toast';

export default function NotFound({auth,flash}) {

    // useEffect(() => {
    //     if (flash.message.success) {
    //         toast.success(flash.message.success);
    //     }
    //     if (flash.message.error) {
    //         toast.error(flash.message.error);
    //     }
    // }, [flash]);

    return (
        <Authenticated user={auth.user} header={<h2>Erreur 404 – Page introuvable</h2>}>
            <Head title="Erreur 404 – Page introuvable" />
        <div className="notfound-container">
            <h1 className="notfound-title">404</h1>
            <p className="notfound-message">Oups ! La page que vous recherchez n'existe pas.</p>
        </div>
        </Authenticated>
    );
}
