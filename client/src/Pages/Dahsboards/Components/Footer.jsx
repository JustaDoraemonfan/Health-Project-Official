import React from "react";

export default function Footer() {
  return (
    <div className="text-center mt-12 pt-8 border-t border-gray-700">
      <p className="text-gray-500 font-mono text-sm">
        Need help? Contact support or visit our help center
      </p>
      <div className="flex items-center justify-center gap-4 mt-3">
        <button className="text-blue-400 hover:text-blue-300 font-mono text-sm transition-colors duration-200">
          Help Center
        </button>
        <span className="text-gray-600">•</span>
        <button className="text-blue-400 hover:text-blue-300 font-mono text-sm transition-colors duration-200">
          Support
        </button>
        <span className="text-gray-600">•</span>
        <button className="text-blue-400 hover:text-blue-300 font-mono text-sm transition-colors duration-200">
          Settings
        </button>
      </div>
    </div>
  );
}
