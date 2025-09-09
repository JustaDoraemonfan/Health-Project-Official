import React from "react";
import { Pill } from "lucide-react";

const PrescriptionCard = ({ prescription }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border google-sans-code-400 border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <Pill className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {prescription.medication}
            </h3>
            <span className="text-sm font-medium text-gray-600">
              {prescription.refills} refills left
            </span>
          </div>
          <p className="text-gray-600 mb-2">{prescription.dosage}</p>
          <div className="text-sm text-gray-500">
            Prescribed by{" "}
            <span className="font-medium">{prescription.prescriber}</span> on{" "}
            {prescription.date}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
