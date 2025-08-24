import React from "react";
import { Stethoscope } from "lucide-react";

const Header = ({ onLogoClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={onLogoClick} className="flex items-center group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold mr-3 shadow-lg group-hover:shadow-xl transition-shadow">
              <Stethoscope size={22} />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                MediBridge
              </span>
              <div className="text-xs text-slate-500 -mt-0.5">
                Healthcare Platform
              </div>
            </div>
          </button>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
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
