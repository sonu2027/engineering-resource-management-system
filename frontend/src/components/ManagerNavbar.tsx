import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // or use Heroicons if available
import { FiLogOut } from "react-icons/fi";

export const ManagerNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logout, setLogout] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white border-b shadow-md fixed w-full z-20 top-0 left-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <Link to="/home" className="text-xl font-semibold text-blue-600">
                    ManagerPanel
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/home" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                        Home
                    </Link>
                    <Link to="/engineer" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                        Engineers
                    </Link>
                    <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                        Dashboard
                    </Link>
                    <FiLogOut onClick={() => setLogout(true)} className="text-sm font-medium text-gray-700 hover:text-blue-600" />
                </div>

                <button onClick={toggleMenu} className="md:hidden text-gray-700 focus:outline-none">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white shadow-md border-t">
                    <Link to="/home" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
                    <Link to="/engineer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Engineers</Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <div onClick={() => setLogout(true)} className="px-4 py-2 hover:bg-gray-100">
                        <FiLogOut className="block text-gray-700" />
                    </div>
                </div>
            )}
            {
                logout &&
                <div className="inset-0">
                    hello
                </div>
            }
        </nav>
    );
};
