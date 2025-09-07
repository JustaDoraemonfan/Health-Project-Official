import { LogOut, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Header Component
const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-[var(--color-primary)]/90 backdrop-blur-sm z-50">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.1) 50%, transparent 60%)`,
          backgroundSize: "20px 20px",
        }}
      />
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl google-sans-code-400 font-bold text-[var(--color-secondary)]">
            Healthy<span className="text-blue-400">Me</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8 items-center z-60">
          {/* ✅ Logout Button */}
          {isAuthenticated ? (
            <>
              <button
                onClick={logout}
                className="flex items-center gap-1 hover:cursor-pointer px-3 py-1.5 bg-transparent hover:text-gray-500 text-[var(--color-secondary)] text-sm rounded-xs google-sans-code-400 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              {/* 🚨 Emergency Link */}
              <button
                onClick={() => navigate("/emergency")}
                className="flex items-center gap-1 px-3 py-1.5 bg-transparent hover:cursor-pointer hover:text-gray-500 text-[var(--color-secondary)] text-sm rounded-xs google-sans-code-400 transition-colors duration-200"
              >
                <MapPin className="w-4 h-4" />
                Emergency
              </button>
            </>
          ) : (
            <>
              <a
                href="#home"
                className="text-[var(--color-secondary)] hover:text-slate-400 hover:cursor-pointer transition-colors duration-200 google-sans-code-400 text-sm"
              >
                ~/home
              </a>
              <a
                href="#stats"
                className="text-[var(--color-secondary)] hover:text-slate-400 hover:cursor-pointer transition-colors duration-200 google-sans-code-400 text-sm"
              >
                ~/analytics
              </a>
              <a
                href="#register"
                className="text-[var(--color-secondary)] hover:text-slate-400 hover:cursor-pointer transition-colors duration-200 google-sans-code-400 text-sm"
              >
                ~/register
              </a>
              <a
                href="#about"
                className="text-[var(--color-secondary)] hover:text-slate-400 hover:cursor-pointer transition-colors duration-200 google-sans-code-400 text-sm"
              >
                ~/about
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
