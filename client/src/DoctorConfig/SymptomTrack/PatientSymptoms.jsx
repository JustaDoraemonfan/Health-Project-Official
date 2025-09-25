import React, { useState } from "react";
import SymptomCard from "./SymptomCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDate } from "../../utils/dateUtils";

const PatientSymptoms = ({ patient, symptoms, loading, onBack }) => {
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  return (
    <div
      className="min-h-screen google-sans-code-400"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {/* Header with back button */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        <div className="relative px-4 py-8 md:px-6 md:py-12 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-var(--color-primary) border-black/20 hover:shadow-md transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Patients
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-light mb-2 tracking-tight"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {patient.name}'s Symptoms
                </h1>
                <p
                  className="text-lg md:text-xl font-light opacity-60"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {symptoms.length} active symptom
                  {symptoms.length !== 1 ? "s" : ""} reported
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-primary)",
                  }}
                >
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-right">
                  <p
                    className="text-lg font-medium"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    Age {patient.age || "N/A"}
                  </p>
                  <p
                    className="text-sm opacity-50"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    Joined: {formatDate(patient.lastVisit)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state for symptoms */}
      {loading && (
        <div className="px-4 pb-12 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <LoadingSpinner message="Loading symptoms..." />
          </div>
        </div>
      )}

      {/* Symptoms List */}
      {!loading && (
        <div className="px-4 pb-12 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {symptoms.length === 0 ? (
              <div className="text-center py-16">
                <p
                  className="text-xl font-light opacity-60"
                  style={{ color: "var(--color-secondary)" }}
                >
                  No symptoms reported yet
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:gap-4">
                {symptoms.map((symptom) => (
                  <SymptomCard
                    key={symptom.id}
                    symptom={symptom}
                    isExpanded={selectedSymptom === symptom.id}
                    onToggle={() =>
                      setSelectedSymptom(
                        selectedSymptom === symptom.id ? null : symptom.id
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSymptoms;
