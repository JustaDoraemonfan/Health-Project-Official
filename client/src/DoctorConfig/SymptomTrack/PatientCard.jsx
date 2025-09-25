import React from "react";
import { formatDate } from "../../utils/dateUtils";

const PatientCard = ({ patient, onClick }) => {
  return (
    <div
      className="group relative border border-black/10 rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
      style={{ backgroundColor: "var(--color-secondary)" }}
      onClick={onClick}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-secondary)",
              }}
            >
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
              <div
                className="flex items-center gap-4 text-sm opacity-60"
                style={{ color: "var(--color-primary)" }}
              >
                <span>Age {patient.age || "N/A"}</span>
                <span>•</span>
                <span>
                  {patient.gender
                    ? `${
                        patient.gender.charAt(0).toUpperCase() +
                        patient.gender.slice(1)
                      }`
                    : "N/A"}
                </span>
                <span>•</span>
                <span>Joined: {formatDate(patient.lastVisit)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {patient.symptoms?.length || 0}
              </p>
              <p className="text-sm opacity-90 text-green-200">
                {patient.symptoms?.length > 1
                  ? "Symptoms Tracked"
                  : "Symptom Tracked"}
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
                {patient.status || "active"}
              </span>
            </div>

            <svg
              className="w-6 h-6 opacity-40 group-hover:opacity-80 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--color-secondary)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
