import { Code } from "lucide-react";

// Header Component
const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-[#292929] backdrop-blur-md border-b border-gray-700/50 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-mono font-bold text-gray-100">
            Healthy<span className="text-blue-400">Me</span>
          </div>
        </div>
        <div className="hidden md:flex space-x-8">
          <a
            href="#home"
            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-mono text-sm"
          >
            ~/home
          </a>
          <a
            href="#stats"
            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-mono text-sm"
          >
            ~/analytics
          </a>
          <a
            href="#login"
            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-mono text-sm"
          >
            ~/login
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
