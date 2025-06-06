import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';

export default function Modal({
                                  children,
                                  show = false,
                                  maxWidth = '2xl',
                                  closeable = true,
                                  onClose = () => {},
                              }) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={close}
            >
                <div className="absolute inset-0  bg-black bg-opacity-50 dark:bg-gray-900/75" />

                <DialogPanel
                        className={`mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full dark:bg-gray-800 ${maxWidthClass}`}
                    >
                        {children}
                    </DialogPanel>
            </Dialog>
        </Transition>
    );
}
