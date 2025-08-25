import React from "react";
import { Stethoscope } from "lucide-react";

const Header = ({ onLogoClick }) => {
  return (
    <header className="bg-[#1c1c1c]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={onLogoClick} className="flex items-center group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold mr-3 shadow-lg group-hover:shadow-xl transition-shadow">
              <Stethoscope size={22} />
            </div>
            <div>
              <span className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                MediBridge
              </span>
              <div className="text-xs text-gray-400 -mt-0.5">
                Healthcare Platform
              </div>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
            >
              Help
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
