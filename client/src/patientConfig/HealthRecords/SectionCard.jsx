import React from "react";
import { ChevronRight } from "lucide-react";

const SectionCard = ({ section, onClick, count }) => {
  const IconComponent = section.icon;

  return (
    <div
      onClick={() => onClick(section.id)}
      className="bg-[var(--color-secondary)]/90 rounded-2xl shadow-lg border google-sans-code-400 border-gray-100 p-8 cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className={`bg-gradient-to-r ${section.gradient} p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
        >
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2 group-hover:text-slate-300 transition-colors duration-300">
          {section.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span
            className={`bg-${section.color}-100 text-${section.color}-800 px-3 py-1 rounded-full text-sm font-semibold`}
          >
            {count} items
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
