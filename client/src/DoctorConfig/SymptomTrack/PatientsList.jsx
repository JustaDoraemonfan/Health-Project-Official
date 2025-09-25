import React from "react";
import PatientCard from ".//PatientCard";
import { formatDate } from "../../utils/dateUtils";

const PatientsList = ({ patients, onPatientClick }) => {
  return (
    <div className="min-h-screen google-sans-code-400 bg-[var(--color-primary)]">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        <div className="relative px-4 py-8 md:px-6 md:py-12 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-light mb-2 tracking-tight"
                  style={{ color: "var(--color-secondary)" }}
                >
                  My Patients
                </h1>
                <p
                  className="text-lg md:text-xl font-medium opacity-60"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {patients.length} Assigned Patient
                  {patients.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="px-4 pb-12 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-3 md:gap-4">
            {patients.map((patient) => (
              <PatientCard
                key={patient._id}
                patient={patient}
                onClick={() => onPatientClick(patient)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/10">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-secondary)" }}
              ></div>
              <p
                className="text-sm font-medium opacity-60"
                style={{ color: "var(--color-secondary)" }}
              >
                All patients loaded
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;
