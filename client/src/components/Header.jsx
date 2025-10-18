import { useState } from "react";
import {
  LogOut,
  MapPin,
  Bell,
  Home,
  BarChart3,
  UserPlus,
  Info,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

  return (
    <header className="fixed top-0 google-sans-code-400 w-full bg-[var(--color-primary)]/95 backdrop-blur-md z-50 border-b border-white/10">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
          backgroundSize: "25px 25px",
        }}
      />
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl google-sans-code-400 font-bold text-[var(--color-secondary)]">
            Healthy<span className="text-blue-400">Me</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6 items-center z-60 ">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/notification")}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 hover:text-zinc-500 text-[var(--color-secondary)] text-sm rounded-lg transition-all duration-200 border border-transparent hover:border-white/20"
              >
                <Bell className="w-4 h-4 text-amber-500" />~ notifications
              </button>
              <button
                onClick={() => navigate("/emergency")}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 hover:text-zinc-500 text-[var(--color-secondary)] text-sm rounded-lg transition-all duration-200 border border-transparent hover:border-white/20"
              >
                <MapPin className="w-4 h-4 text-red-500" />~ emergency
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-[var(--color-secondary)] text-sm rounded-lg transition-all duration-200 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4 text-red-500" />~ logout
              </button>
            </>
          ) : (
            <>
              <a href="#home" className="flex items-center gap-2 px-4 py-2 ...">
                <Home className="w-4 h-4 text-blue-400" /> ~/home
              </a>
              <a
                href="#stats"
                className="flex items-center gap-2 px-4 py-2 ..."
              >
                <BarChart3 className="w-4 h-4 text-green-400" /> ~/analytics
              </a>
              <a
                href="#register"
                className="flex items-center gap-2 px-4 py-2 ..."
              >
                <UserPlus className="w-4 h-4 text-purple-400" /> ~/register
              </a>
              <a
                href="#about"
                className="flex items-center gap-2 px-4 py-2 ..."
              >
                <Info className="w-4 h-4 text-cyan-400" /> ~/about
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-[var(--color-secondary)]"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="absolute top-full left-0 w-full bg-[var(--color-primary)]/95 backdrop-blur-md border-t border-white/10 flex flex-col items-center space-y-4 py-4 md:hidden z-50">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/notification")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <Bell className="w-4 h-4 text-amber-500" /> ~notifications
                </button>
                <button
                  onClick={() => navigate("/emergency")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <MapPin className="w-4 h-4 text-red-500" /> ~emergency
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4 text-red-500" /> ~logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="#home"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <Home className="w-4 h-4 text-blue-400" /> ~/home
                </a>
                <a
                  href="#stats"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <BarChart3 className="w-4 h-4 text-green-400" /> ~/analytics
                </a>
                <a
                  href="#register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <UserPlus className="w-4 h-4 text-purple-400" /> ~/register
                </a>
                <a
                  href="#about"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <Info className="w-4 h-4 text-cyan-400" /> ~/about
                </a>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
