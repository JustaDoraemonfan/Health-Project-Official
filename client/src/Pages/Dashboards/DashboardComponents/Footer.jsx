import React from "react";

export default function Footer({ role = "patient" }) {
  const isDoctor = role === "doctor";

  const message = isDoctor
    ? "Medical support available 24/7 • Contact IT for technical assistance"
    : "Need help? Contact support or visit our help center";

  const links = isDoctor
    ? [
        {
          text: "Medical Guidelines",
          onClick: () => console.log("Medical Guidelines"),
        },
        { text: "IT Support", onClick: () => console.log("IT Support") },
        {
          text: "Emergency Contacts",
          onClick: () => console.log("Emergency Contacts"),
        },
      ]
    : [
        { text: "Help Center", onClick: () => console.log("Help Center") },
        { text: "Support", onClick: () => console.log("Support") },
        { text: "Settings", onClick: () => console.log("Settings") },
      ];

  return (
    <div className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700">
      <p className="text-gray-500 spline-sans-mono-400 text-xs sm:text-sm px-4">
        {message}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-2 sm:mt-3 px-4">
        {links.map((link, index) => (
          <React.Fragment key={link.text}>
            {index > 0 && (
              <span className="text-gray-600 hidden sm:inline">•</span>
            )}
            <button
              onClick={link.onClick}
              className="text-blue-400 hover:text-blue-300 hover:cursor-pointer spline-sans-mono-400 text-xs sm:text-sm transition-colors duration-200"
            >
              {link.text}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
