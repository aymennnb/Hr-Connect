import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React from "react";

function IndexSalaire({ auth }) {
    return (
        <Authenticated
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gestion des Salaires
                </h2>
            }
        >
            <Head title="Salaires" />

            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Page en cours de développement
                            </h3>
        </Authenticated>
    );
}

export default IndexSalaire;