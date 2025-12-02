// components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#161515] border-t border-slate-700 px-6 py-4 spline-sans-mono-400 text-center">
      <div className="flex justify-center gap-4 text-slate-400 text-sm">
        <a href="#home" className="hover:text-blue-400 transition-colors">
          Home
        </a>
        <span>·</span>
        <a
          href="#appointments"
          className="hover:text-blue-400 transition-colors"
        >
          Appointments
        </a>
        <span>·</span>
        <a href="#logout" className="hover:text-blue-400 transition-colors">
          Logout
        </a>
      </div>
    </footer>
  );
};

export default Footer;
