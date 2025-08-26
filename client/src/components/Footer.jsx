// client/src/components/Footer.jsx
import React from "react";
import {
  Github,
  Code,
  Heart,
  Activity,
  Users,
  Shield,
  FileText,
  Mail,
  Terminal,
  Database,
  Server,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#161515] to-black border-t border-gray-800">
      {/* Terminal Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="font-mono text-sm text-gray-400">
              <Terminal className="w-4 h-4 inline mr-2" />
              ./healthyme-platform --status=running
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Platform Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-mono font-bold text-white">
                HealthyMe
              </h3>
            </div>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              A comprehensive healthcare management platform connecting
              patients, doctors, and frontline workers through secure digital
              infrastructure.
            </p>
            <div className="flex items-center gap-2 text-green-400 font-mono text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Status: Online</span>
            </div>
          </div>

          {/* User Roles */}
          <div className="space-y-4">
            <h3 className="text-white font-mono font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Access
            </h3>
            <nav className="space-y-2">
              <a
                href="#patient-portal"
                className="block text-gray-400 hover:text-blue-400 font-mono text-sm transition-colors duration-200"
              >
                → Patient Portal
              </a>
              <a
                href="#doctor-dashboard"
                className="block text-gray-400 hover:text-blue-400 font-mono text-sm transition-colors duration-200"
              >
                → Doctor Dashboard
              </a>
              <a
                href="#frontline-access"
                className="block text-gray-400 hover:text-blue-400 font-mono text-sm transition-colors duration-200"
              >
                → Frontline Worker Access
              </a>
              <a
                href="#admin-panel"
                className="block text-gray-400 hover:text-blue-400 font-mono text-sm transition-colors duration-200"
              >
                → Admin Panel
              </a>
            </nav>
          </div>

          {/* Platform Features */}
          <div className="space-y-4">
            <h3 className="text-white font-mono font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Platform
            </h3>
            <nav className="space-y-2">
              <a
                href="#security"
                className="block text-gray-400 hover:text-green-400 font-mono text-sm transition-colors duration-200"
              >
                → Security & Privacy
              </a>
              <a
                href="#api-docs"
                className="block text-gray-400 hover:text-green-400 font-mono text-sm transition-colors duration-200"
              >
                → API Documentation
              </a>
              <a
                href="#system-status"
                className="block text-gray-400 hover:text-green-400 font-mono text-sm transition-colors duration-200"
              >
                → System Status
              </a>
              <a
                href="#integrations"
                className="block text-gray-400 hover:text-green-400 font-mono text-sm transition-colors duration-200"
              >
                → Healthcare Integrations
              </a>
            </nav>
          </div>

          {/* Technical Stack */}
          <div className="space-y-4">
            <h3 className="text-white font-mono font-semibold flex items-center gap-2">
              <Code className="w-4 h-4" />
              Tech Stack
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                <Database className="w-3 h-3" />
                <span>MongoDB + Mongoose</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                <Server className="w-3 h-3" />
                <span>Node.js + Express</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                <Code className="w-3 h-3" />
                <span>React + Vite</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                <Shield className="w-3 h-3" />
                <span>JWT Authentication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Repository Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Github className="w-6 h-6 text-white" />
                <div>
                  <h4 className="text-white font-mono font-semibold">
                    Open Source Healthcare Platform
                  </h4>
                  <p className="text-gray-400 font-mono text-sm">
                    Fork, contribute, and help improve healthcare accessibility
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    window.open(
                      "https://github.com/JustaDoraemonfan/Health-Project-Official",
                      "_blank"
                    )
                  }
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded font-mono text-sm text-gray-300 transition-colors duration-200"
                >
                  <Github className="w-4 h-4 inline mr-2" />
                  View Repository
                </button>
                <button
                  onClick={() =>
                    window.open(
                      "https://github.com/JustaDoraemonfan/Health-Project-Official/fork",
                      "_blank"
                    )
                  }
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded font-mono text-sm text-white transition-all duration-200"
                >
                  <Code className="w-4 h-4 inline mr-2" />
                  Fork Project
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Contact */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-4 text-gray-400 font-mono text-sm">
              <span>© {currentYear} HealthyMe Platform</span>
              <div className="hidden md:flex items-center gap-4">
                <a
                  href="#privacy"
                  className="hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="#hipaa"
                  className="hover:text-white transition-colors duration-200"
                >
                  HIPAA Compliance
                </a>
              </div>
            </div>

            {/* Contact & Git Info */}
            <div className="flex items-center gap-6">
              <a
                href="mailto:support@healthyme.dev"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 font-mono text-sm transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                support@healthyme.dev
              </a>

              <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>v1.2.3</span>
                <span>•</span>
                <span>commit: a7b3c2d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Terminal Line */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="text-center text-gray-500 font-mono text-xs">
            <span className="text-green-400">healthyme@platform</span>
            <span className="text-gray-600">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-gray-600">$ </span>
            <span className="text-gray-400">
              Making healthcare accessible through technology
            </span>
            <span className="animate-pulse">|</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
