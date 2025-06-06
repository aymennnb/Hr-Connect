import { useWindowWidth } from "@/hooks/useWindowWidth.js";


export default function ModalWrapper({title,onClose,children,width = '60%',maxHeight = '70vh',showCloseButton = true,noScroll = false,}) {

    const Width = useWindowWidth();

    return (
        <>
        {Width > 550 ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div
                    style={{ width }}
                    className="bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-3xl text-gray-600 hover:text-gray-900 p-2 rounded-full"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                    <div className={noScroll ? "" : "overflow-y-auto"} style={{ maxHeight }}>
                        {children}
                    </div>
                </div>
            </div>
        ):
            (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="bg-white p-3 rounded-lg shadow-lg flex flex-col space-y-1 w-[85%]"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-md font-medium text-gray-900">{title}</h3>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-2xl text-gray-600 hover:text-gray-900 p-2 rounded-full"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                        <div className={noScroll ? "" : "overflow-y-auto"} style={{ maxHeight }}>
                            {children}
                        </div>
                    </div>
                </div>
            )
        }
        </>
    );
}
