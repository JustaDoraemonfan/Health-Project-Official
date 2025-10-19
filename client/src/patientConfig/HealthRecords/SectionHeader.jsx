import React from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { sections, filterOptions } from "./constants";

const SectionHeader = ({
  selectedSection,
  setSelectedSection,
  appointmentFilter,
  setAppointmentFilter,
}) => {
  const section = sections.find((s) => s.id === selectedSection);

  return (
    <div className="bg-[var(--color-secondary)]/90 shadow-sm border-b google-sans-code-400 border-gray-200 sticky top-0 z-10">
      {/* Responsive padding */}
      <div className="px-4 sm:px-6 py-4">
        {/* Layout stacks on mobile, becomes a row on medium screens */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left Side: Back button and Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedSection(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div
                className={`bg-gradient-to-r ${section?.gradient} p-2 rounded-lg`}
              >
                {React.createElement(section?.icon || FileText, {
                  className: "w-6 h-6 text-white",
                })}
              </div>
              {/* Responsive title font size */}
              <h2 className="text-xl md:text-2xl font-light text-[var(--color-primary)]">
                {section?.title}
              </h2>
            </div>
          </div>

          {/* Right Side: Filter Buttons */}
          {selectedSection === "appointments" && (
            // Buttons stack on mobile, become a row on small screens
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAppointmentFilter(option.value)}
                  // Responsive width and text alignment
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 w-full sm:w-auto text-center ${
                    appointmentFilter === option.value
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
