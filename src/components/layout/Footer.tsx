
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold title-gradient">YourViews</span>
            </Link>
            <p className="text-gray-600 mb-4 text-sm">
              Share your opinion on social issues and see what others think.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/topics" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                  Topics
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-brand-purple transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex justify-center items-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} YourViews. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
