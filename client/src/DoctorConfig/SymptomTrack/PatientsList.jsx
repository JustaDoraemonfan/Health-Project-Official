import React from "react";
import PatientCard from "./PatientCard";
// formatDate is imported but not used in *this* file, which is fine.
// import { formatDate } from "../../utils/DateHelpers";

const PatientsList = ({ patients, onPatientClick }) => {
  return (
    // min-h-screen ensures the background color fills the viewport
    <div className="min-h-screen google-sans-code-400 bg-[var(--color-primary)]">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        {/* Responsive padding: 4 on mobile, 6 on md, 8 on lg */}
        <div className="relative px-4 py-8 md:px-6 md:py-12 lg:px-8">
          {/* Constrains width on large screens, centers content */}
          <div className="max-w-6xl mx-auto">
            {/* --- THIS IS THE KEY RESPONSIVE LAYOUT --- */}
            {/* Stacks on mobile (flex-col) */}
            {/* Becomes horizontal on medium+ screens (md:flex-row) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1
                  // Responsive text: 3xl on mobile, 4xl on md, 5xl on lg
                  className="text-3xl md:text-4xl lg:text-5xl font-light mb-2 tracking-tight"
                  style={{ color: "var(--color-secondary)" }}
                >
                  My Patients
                </h1>
                <p
                  // Responsive text: lg on mobile, xl on md
                  className="text-lg md:text-xl font-medium opacity-60"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {patients.length} Assigned Patient
                  {patients.length !== 1 ? "s" : ""}
                </p>
              </div>
              {/* You could add a button here, like "Add New Patient" */}
              {/* It would stack under the title on mobile and sit to the right on desktop */}
            </div>
          </div>
        </div>
      </div>

      {/* Patients List */}
      {/* Responsive padding */}
      <div className="px-4 pb-12 md:px-6 lg:px-8">
        {/* Constrains width on large screens, centers content */}
        <div className="max-w-6xl mx-auto">
          {/* A single-column grid is inherently responsive. 
            It just stacks the PatientCard components.
            The responsiveness is handled *inside* PatientCard.
            Responsive gap: 3 on mobile, 4 on md
          */}
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
          {/* text-center is responsive by default */}
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
