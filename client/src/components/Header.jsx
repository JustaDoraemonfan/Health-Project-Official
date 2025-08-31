import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// Header Component
const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="fixed top-0 w-full bg-[#292929] backdrop-blur-md border-b border-gray-700/50 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-mono font-bold text-gray-100">
            Healthy<span className="text-blue-400">Me</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {/* ✅ Logout Button */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 hover:cursor-pointer px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-md font-mono transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              logout
            </button>
          ) : (
            <>
              <a
                href="#home"
                className="text-gray-300 hover:text-blue-400 hover:cursor-pointer transition-colors duration-200 font-mono text-sm"
              >
                ~/home
              </a>
              <a
                href="#stats"
                className="text-gray-300 hover:text-blue-400 hover:cursor-pointer transition-colors duration-200 font-mono text-sm"
              >
                ~/analytics
              </a>
              <a
                href="#login"
                className="text-gray-300 hover:text-blue-400 hover:cursor-pointer transition-colors duration-200 font-mono text-sm"
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
