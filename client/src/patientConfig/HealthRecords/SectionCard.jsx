import React from "react";
import { ChevronRight } from "lucide-react";

// It's a best practice to map dynamic Tailwind classes to full strings
// so the compiler can detect and include them in the final CSS build.
const colorVariants = {
  blue: {
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
  },
  green: {
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
  },
  purple: {
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  orange: {
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-800",
  },
  // Add other colors you might use here
  default: {
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-800",
  },
};

const SectionCard = ({ section, onClick, count }) => {
  const IconComponent = section.icon;
  const colors = colorVariants[section.color] || colorVariants.default;

  return (
    <div
      onClick={() => onClick(section.id)}
      // Responsive padding: p-6 on mobile, p-8 on medium screens and up
      className="bg-[var(--color-secondary)] rounded-2xl shadow-lg border google-sans-code-400 border-gray-100 p-6 md:p-8 cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className={`bg-gradient-to-r ${section.gradient} p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
        >
          {/* Responsive icon size */}
          <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
      </div>

      <div className="mb-4">
        {/* Responsive title size */}
        <h3 className="text-lg sm:text-xl font-bold text-[var(--color-primary)] mb-2 group-hover:text-slate-300 transition-colors duration-300">
          {section.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span
            className={`${colors.badgeBg} ${colors.badgeText} px-3 py-1 rounded-full text-sm font-semibold`}
          >
            {/* Added logic for pluralizing "item" */}
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <p className="text-slate-500 text-sm leading-relaxed">
        {section.description}
      </p>
    </div>
  );
};

export default SectionCard;
