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
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedSection(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
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
              <h2 className="text-2xl font-light text-[var(--color-primary)]">
                {section?.title}
              </h2>
            </div>
          </div>

          {selectedSection === "appointments" && (
            <div className="flex space-x-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAppointmentFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
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
