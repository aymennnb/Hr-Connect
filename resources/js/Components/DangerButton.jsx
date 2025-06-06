export default function DangerButton({
                                         className = '',
                                         disabled,
                                         children,
                                         ...props
                                     }) {
    return (
        <button
            {...props}
            className={
                `hover:text-red-900  inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-red-600 transition duration-150 ease-in-out  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700 dark:focus:ring-offset-gray-800 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
