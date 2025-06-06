import React from "react";
import { useForm } from "@inertiajs/react";
import {useWindowWidth} from "@/hooks/useWindowWidth.js";

export default function ImportSitesXLSX({ auth, setshowAddFileForm }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });
    const Width = useWindowWidth();

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("sites.import"), {
            forceFormData: true,
            onSuccess: () => {
                setshowAddFileForm(false);
                reset();
            },
        });
    };

    return (
        <>
            {Width > 930 ? (
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium mb-4">Importer un fichier Excel</h3>

                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-6">
                                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                                        Sélectionnez un fichier Excel (.xlsx, .xls)
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        accept=".xlsx,.xlsw"
                                        onChange={(e) => setData("file", e.target.files[0])}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.file && (
                                        <p className="text-sm text-red-600 mt-1">{errors.file}</p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setshowAddFileForm(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.file}
                                        className={`px-4 py-2 text-white rounded ${
                                            processing || !data.file ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        {processing ? "Importation..." : "Importer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div> ) : (
                <div className="w-full px-2 py-1">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="p-3">
                            <h3 className="text-sm font-medium mb-2">Importer un fichier Excel</h3>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* File Input */}
                                <div className="mb-2">
                                    <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor="file">
                                        Sélectionnez un fichier Excel (.xlsx, .xls)
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={(e) => setData("file", e.target.files[0])}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    {errors.file && <p className="mt-1 text-[10px] text-red-600">{errors.file}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setshowAddFileForm(false)}
                                        className="flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.file}
                                        className={`flex-1 px-2 py-1 text-xs text-white rounded-md transition ${
                                            processing || !data.file ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        {processing ? "Importation..." : "Importer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
