import React from "react";
// Assuming formatDate is from the date helper file you provided
import { formatDate } from "../../utils/DateHelpers";

const PatientCard = ({ patient, onClick }) => {
  return (
    <div
      className="group relative border border-black/10 rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
      style={{ backgroundColor: "var(--color-secondary)" }}
      onClick={onClick}
    >
      {/* Main content padding */}
      <div className="p-6 md:p-8">
        {/* Responsive main flex container */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Block 1: Patient Info (Name, Initials, Details) */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-medium"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-secondary)",
              }}
            >
              {/* Initials logic */}
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3
                className="text-xl md:text-2xl font-medium mb-1"
                style={{ color: "var(--color-primary)" }}
              >
                {patient.name}
              </h3>

              {/* Responsive & Wrapping Detail Row */}
              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm opacity-60"
                style={{ color: "var(--color-primary)" }}
              >
                <span>Age {patient.age || "N/A"}</span>

                {/* Hide separator on extra-small screens if they wrap */}
                <span className="hidden sm:inline">•</span>

                <span>
                  {patient.gender
                    ? `${
                        patient.gender.charAt(0).toUpperCase() +
                        patient.gender.slice(1)
                      }`
                    : "N/A"}
                </span>

                <span className="hidden sm:inline">•</span>

                {/* Allow this to wrap to a new line on its own */}
                <span className="w-full sm:w-auto">
                  Joined: {formatDate(patient.lastVisit)}
                </span>
              </div>
            </div>
          </div>

          {/* Block 2: Stats (Symptoms & Status) */}
          {/* On mobile: full-width, spaced-between. On md: auto-width, gapped. */}
          <div className="flex items-center justify-between md:justify-start md:gap-6">
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {patient.symptoms?.length || 0}
              </p>
              {/* Abbreviated text for small screens */}
              <p className="text-sm opacity-90 text-green-200">
                <span className="sm:hidden">
                  {patient.symptoms?.length === 1 ? "Symptom" : "Symptoms"}
                </span>
                <span className="hidden sm:inline">
                  {patient.symptoms?.length === 1
                    ? "Symptom Tracked"
                    : "Symptoms Tracked"}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  patient.status === "active" ? "" : "opacity-40"
                }`}
                style={{ backgroundColor: "var(--color-primary)" }}
              ></div>
              <span
                className="text-sm font-medium opacity-60"
                style={{ color: "var(--color-primary)" }}
              >
                {/* Capitalize status */}
                {patient.status
                  ? patient.status.charAt(0).toUpperCase() +
                    patient.status.slice(1)
                  : "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Absolutely Positioned Arrow Icon */}
      {/* This is much cleaner for responsiveness */}
      <svg
        className="w-6 h-6 absolute top-1/2 -translate-y-1/2 right-6 md:right-8 opacity-40 group-hover:opacity-80 transition-opacity"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        // Changed to --color-primary assuming it was a typo,
        // as --color-secondary would make it invisible against the background.
        style={{ color: "var(--color-primary)" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
};

export default PatientCard;
