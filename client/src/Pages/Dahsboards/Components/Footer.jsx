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
    <div className="text-center mt-12 pt-8 border-t border-gray-700">
      <p className="text-gray-500 google-sans-code-400 text-sm">{message}</p>
      <div className="flex items-center justify-center gap-4 mt-3">
        {links.map((link, index) => (
          <React.Fragment key={link.text}>
            {index > 0 && <span className="text-gray-600">•</span>}
            <button
              onClick={link.onClick}
              className="text-blue-400 hover:text-blue-300 google-sans-code-400 text-sm transition-colors duration-200"
            >
              {link.text}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
