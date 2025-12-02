import React from "react";
import { Lock } from "lucide-react";

const SecureFooter = ({ isMainView = false }) => {
  // Responsive padding and margin
  const baseClasses = "bg-transparent p-4 sm:p-6";
  const containerClasses = isMainView ? "mt-6" : "mt-8";

  return (
    <div className={`${baseClasses} spline-sans-mono-400 ${containerClasses}`}>
      {/* - Mobile: Stacks vertically (flex-col), items are centered.
        - Small screens (sm) & up: Becomes a horizontal row.
      */}
      <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left text-xs sm:text-sm font-light gap-2 text-gray-600">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-light">Secure Access</span>
        </div>

        {/* Separator: hidden on mobile, visible on sm+ */}
        <span className="hidden sm:inline">•</span>

        <span>Your health information is protected and encrypted</span>
      </div>
    </div>
  );
};

export default SecureFooter;
