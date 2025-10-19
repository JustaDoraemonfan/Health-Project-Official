import React from "react";
import { Pill } from "lucide-react";

const PrescriptionCard = ({ prescription }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border google-sans-code-400 border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Use items-start for better alignment if text wraps */}
      <div className="flex items-start space-x-4">
        <div className="bg-green-50 p-3 rounded-lg flex-shrink-0">
          <Pill className="w-5 h-5 text-green-600" />
        </div>

        {/* Add min-w-0 to allow text to truncate/wrap correctly in flex */}
        <div className="flex-1 min-w-0">
          {/* Header: Stacks on mobile, row on sm+ */}
          <div className="flex flex-col items-start gap-1 mb-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {prescription.medication}
            </h3>
            <span className="text-sm font-medium text-gray-600 flex-shrink-0">
              {prescription.refills} refills left
            </span>
          </div>

          <p className="text-gray-600 mb-2">{prescription.dosage}</p>

          {/* Footer: Added flex-wrap for cases where prescriber name is long */}
          <div className="text-sm text-gray-500 flex flex-wrap gap-x-1">
            <span>Prescribed by</span>
            <span className="font-medium">{prescription.prescriber}</span>
            <span>on</span>
            <span>{prescription.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
