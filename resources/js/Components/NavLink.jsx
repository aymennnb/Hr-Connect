import { Link } from "@inertiajs/react";

export default function NavLink({ href, method = 'get', as = 'a', active, children, ...props }) {
    const baseClasses = "block px-4 py-2 rounded transition transform duration-50";
    const activeClasses = active
        ? "bg-[#10b985] text-blue-600 font-medium"
        : "text-gray-300 hover:bg-[#10b975] hover:text-blue-600 hover:translate-x-1";

    return (
        <Link
            href={href}
            method={method}
            as={as}
            {...props}
            className={`${baseClasses} ${activeClasses}`}
        >
            {children}
        </Link>
    );
}
