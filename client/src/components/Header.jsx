import { LogOut, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Header Component
const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-zinc-950/50 backdrop-blur-md border-b border-gray-700/50 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl google-sans-code-400 font-bold text-gray-100">
            Healthy<span className="text-blue-400">Me</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {/* ✅ Logout Button */}
          {isAuthenticated ? (
            <>
              <button
                onClick={logout}
                className="flex items-center gap-1 hover:cursor-pointer px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-xs google-sans-code-400 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              {/* 🚨 Emergency Link */}
              <button
                onClick={() => navigate("/emergency")}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-sm rounded-xs google-sans-code-400 transition-colors duration-200"
              >
                <MapPin className="w-4 h-4" />
                Emergency
              </button>
            </>
          ) : (
            <>
              <a
                href="#home"
                className="text-gray-300 hover:text-blue-400 hover:cursor-pointer transition-colors duration-200 google-sans-code-400 text-sm"
              >
                ~/home
              </a>
              <a
                href="#stats"
                className="text-gray-300 hover:text-blue-400 hover:cursor-pointer transition-colors duration-200 google-sans-code-400 text-sm"
              >
                ~/analytics
              </a>
              <a
                href="#login"
                className="text-gray-300 hover:text-blue-400 hover:cursor-pointer transition-colors duration-200 google-sans-code-400 text-sm"
              >
                ~/login
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
