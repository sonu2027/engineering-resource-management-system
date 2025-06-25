import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";

export const EngineerNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-blue-600">
          EngineerPanel
        </Link>
        <div className="hidden md:flex gap-6">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost">Profile</Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t shadow-sm px-4 py-2 space-y-1">
          <Link to="/" className="block w-full text-left">
            <Button variant="ghost" className="w-full">Home</Button>
          </Link>
          <Link to="/profile" className="block w-full text-left">
            <Button variant="ghost" className="w-full">Profile</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
