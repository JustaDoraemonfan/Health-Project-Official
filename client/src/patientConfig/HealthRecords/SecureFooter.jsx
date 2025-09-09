import React from "react";
import { Lock } from "lucide-react";

const SecureFooter = ({ isMainView = false }) => {
  const baseClasses = "bg-transparent p-6";
  const containerClasses = isMainView ? "mt-6  " : "mt-8";

  return (
    <div className={`${baseClasses} google-sans-code-400 ${containerClasses}`}>
      <div className="flex items-center justify-center text-sm font-light space-x-2 text-gray-600">
        <Lock className="w-5 h-5" />
        <span className="font-light">Secure Access</span>
        <span>•</span>
        <span>Your health information is protected and encrypted</span>
      </div>
    </div>
  );
};

export default SecureFooter;
