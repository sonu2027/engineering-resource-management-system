import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import LogoutModal from "../modals/LogoutModal";
import { FiHome, FiSettings, FiMessageSquare } from "react-icons/fi";
import { useLocation } from "react-router-dom";

export const EngineerNavbar = () => {
  const [open, setOpen] = useState(false);
  const [logout, setLogout] = useState(false)

  const toggleMenu = () => setOpen(!open);
  const location = useLocation()

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/home" className="text-lg font-semibold text-blue-600">
          EngineerPanel
        </Link>
        <div className="hidden sm:flex gap-6 justify-center items-center">
          <Link className={`hover:text-blue-600 font-medium ${location.pathname === "/home" ? "text-gray-900" : "text-gray-700"}`} to="/home">
            Home
          </Link>
          <Link to="/message" className={`text-sm font-medium hover:text-blue-600 ${location.pathname === "/message" ? "text-gray-900" : "text-gray-700"}`}>
            Message
          </Link>
          <Link className={`text-sm font-medium hover:text-blue-600 ${location.pathname === "/profile" ? "text-gray-900" : "text-gray-700"}`} to="/profile">
            Profile
          </Link>
          <FiLogOut onClick={() => setLogout(true)} className="font-medium text-gray-700 hover:bg-gray-100" />
        </div>

        <button onClick={toggleMenu} className="sm:hidden text-gray-700 focus:outline-none">
          {!open && <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 ${open ? "animate-in slide-in-from-left duration-500" : "hidden"} sm:hidden`}>
          <div className="w-[15rem] h-full bg-white shadow-lg border-r flex flex-col p-4 space-y-4 relative">
            <button onClick={toggleMenu} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition">
              <X className="w-5 h-5" />
            </button>

            <nav className="mt-10 flex flex-col space-y-3 text-sm font-medium">
              <Link to="/home" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition ${location.pathname === "/home" ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                <FiHome className="w-4 h-4" /> Home
              </Link>
              <Link to="/message" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition text-gray-700 ${location.pathname === "/message" ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                <FiMessageSquare className="w-4 h-4" /> Message
              </Link>
              <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition text-gray-700 ${location.pathname === "/profile" ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                <FiSettings className="w-4 h-4" /> Profile
              </Link>
              <div onClick={() => setLogout(true)} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-red-100 transition text-red-600 cursor-pointer mt-2">
                <FiLogOut className="w-4 h-4" /> Logout
              </div>
            </nav>
          </div>
        </div>

      )}
      {logout && (
        <LogoutModal setLogout={setLogout} />
      )}

    </nav>
  );
};
