// client/src/components/LoadingSpinner.js
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-[#161515] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-50 font-mono text-lg">{message}</p>
        <div className="mt-4">
          <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
