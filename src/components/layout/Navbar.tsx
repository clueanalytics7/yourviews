

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Polls", path: "/polls" },
    { name: "About", path: "/about" },
  ];

  const authLinks = [
    { name: "Login", path: "/login" },
    { name: "Sign Up", path: "/register" },
  ];

  const renderAuthButtons = () => {
    if (isLoading) {
      return null; // Or a loading spinner
    }

    if (user) {
      return (
        <div className="flex items-center space-x-2">
          <Link to="/profile">
            <Button variant="ghost" className="hover:text-brand-purple">
              Profile
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" className="hover:text-brand-purple">
                Admin
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      );
    }

    return null;
  };

  

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold title-gradient">YourViews</span>
          <span className="hidden sm:inline-block text-xs bg-brand-light-purple text-white px-2 py-0.5 rounded-full">
            Beta
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 focus:outline-none"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-brand-purple transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {!user && authLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-brand-purple transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {user && <div className="flex items-center space-x-3">{renderAuthButtons()}</div>}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute z-50 w-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isMenuOpen
            ? "transform translate-y-0"
            : "transform -translate-y-full hidden"
        }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-brand-purple py-2 transition-colors"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
            {!user && authLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-brand-purple py-2 transition-colors"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            {user && renderAuthButtons()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

