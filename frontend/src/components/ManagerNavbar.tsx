import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FiLogOut } from "react-icons/fi";
import LogoutModal from "../modals/LogoutModal";
import { useLocation } from "react-router-dom";

import { FiHome, FiUser, FiGrid, FiSettings, FiMessageSquare } from "react-icons/fi";

export const ManagerNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logout, setLogout] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen);
    const location = useLocation()


    return (
        <nav className="bg-white border-b shadow-md sticky w-full z-20 top-0 left-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <Link to="/home" className="text-xl font-semibold text-blue-600">
                    ManagerPanel
                </Link>

                <div className="hidden sm:flex gap-6 items-center">
                    <Link to="/home" className={`hover:text-blue-600 font-medium ${location.pathname === "/home" ? "text-gray-900" : "text-gray-700"}`}>
                        Home
                    </Link>
                    <Link to="/engineer" className={`font-medium hover:text-blue-600 ${location.pathname === "/engineer" ? "text-gray-900" : "text-gray-700"}`}>
                        Engineers
                    </Link>
                    <Link to="/dashboard" className={`text-sm font-medium hover:text-blue-600 ${location.pathname === "/dashboard" ? "text-gray-900" : "text-gray-700"}`}>
                        Dashboard
                    </Link>
                    <Link to="/message" className={`text-sm font-medium hover:text-blue-600 ${location.pathname === "/message" ? "text-gray-900" : "text-gray-700"}`}>
                        Message
                    </Link>
                    <Link to="/profile" className={`text-sm font-medium hover:text-blue-600 ${location.pathname === "/profile" ? "text-gray-900" : "text-gray-700"}`}>
                        Profile
                    </Link>
                    <FiLogOut onClick={() => setLogout(true)} className="text-sm font-medium text-gray-700 hover:text-blue-600" />
                </div>

                <button onClick={toggleMenu} className="sm:hidden text-gray-700 focus:outline-none">
                    {!isOpen && <Menu className="w-6 h-6" />}
                </button>
            </div>

            {isOpen && (
                <div className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 ${isOpen ? "animate-in slide-in-from-left duration-500" : "hidden"} sm:hidden`}>
                    <div className="w-[15rem] h-full bg-white shadow-lg border-r flex flex-col p-4 space-y-4 relative">
                        <button onClick={toggleMenu} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition">
                            <X className="w-5 h-5" />
                        </button>

                        <nav className="mt-10 flex flex-col space-y-3 text-sm font-medium">
                            <Link to="/home" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${location.pathname === "/home" ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                                <FiHome className="w-4 h-4" /> Home
                            </Link>
                            <Link to="/engineer" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${location.pathname === "/engineer" ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                                <FiUser className="w-4 h-4" /> Engineers
                            </Link>
                            <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition text-gray-700 ${location.pathname === "/dashboard" ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                                <FiGrid className="w-4 h-4" /> Dashboard
                            </Link>
                            <Link to="/message" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition text-gray-700 ${location.pathname === "/message" ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                                <FiMessageSquare className="w-4 h-4" /> Message
                            </Link>
                            <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition text-gray-700 ${location.pathname === "/profile" ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                                <FiSettings className="w-4 h-4" /> Profile
                            </Link>
                            <div onClick={() => {
                                setIsOpen(false)
                                setLogout(true)
                            }} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-red-100 transition text-red-600 cursor-pointer mt-2">
                                <FiLogOut className="w-4 h-4" /> Logout
                            </div>
                        </nav>
                    </div>
                </div>
            )}
            {
                logout && <LogoutModal setLogout={setLogout} />
            }
        </nav>
    );
};
