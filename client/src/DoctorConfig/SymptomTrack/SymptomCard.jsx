import React from "react";
import { formatDate, getTimeAgo } from "../../utils/dateUtils";
import { getPriorityIndicator } from "../../utils/symptomUtils";

const SymptomCard = ({ symptom, isExpanded, onToggle }) => {
  return (
    <div
      className={`group relative border border-black/10 rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl ${
        isExpanded ? "shadow-xl scale-[1.02]" : "hover:shadow-lg"
      }`}
      style={{ backgroundColor: "var(--color-secondary)" }}
      onClick={onToggle}
    >
      <div
        className="absolute top-0 left-6 w-12 h-0.5 rounded-full"
        style={{
          backgroundColor: "var(--color-primary)",
          opacity:
            symptom.priority === "severe" || symptom.priority === "high"
              ? 1
              : symptom.priority === "moderate" || symptom.priority === "medium"
              ? 0.6
              : 0.3,
        }}
      ></div>

      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                {getPriorityIndicator(symptom.priority)}
                <span
                  className="text-sm font-medium opacity-60"
                  style={{ color: "var(--color-primary)" }}
                >
                  {symptom.priority || "medium"} severity
                </span>
                {symptom.category && (
                  <>
                    <span className="text-sm opacity-30">•</span>
                    <span
                      className="text-sm font-medium opacity-60 capitalize"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {symptom.category}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p
                className={`text-base md:text-lg leading-relaxed transition-all duration-300 ${
                  isExpanded ? "" : "line-clamp-2"
                }`}
                style={{ color: "var(--color-primary)" }}
              >
                {symptom.symptomDescription}
              </p>
              {!isExpanded && symptom.symptomDescription.length > 100 && (
                <button className="text-sm font-medium mt-2 opacity-60 hover:opacity-100 transition-opacity">
                  Read more...
                </button>
              )}

              {/* Show notes when expanded */}
              {isExpanded && symptom.notes && (
                <div className="mt-4 p-4 bg-black/5 rounded-lg">
                  <p
                    className="text-sm font-medium opacity-70 mb-1"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Patient Notes:
                  </p>
                  <p
                    className="text-sm opacity-80"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {symptom.notes}
                  </p>
                </div>
              )}
            </div>

            {isExpanded && (
              <div className="flex flex-wrap gap-3 mb-4 animate-in slide-in-from-top-2 duration-300">
                <button
                  className="px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    color: "var(--color-secondary)",
                    borderColor: "var(--color-secondary)",
                  }}
                >
                  View History
                </button>
                <button
                  className="px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-primary)",
                  }}
                >
                  Add Notes
                </button>
                <button
                  className="px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    color: "var(--color-secondary)",
                    borderColor: "var(--color-secondary)",
                  }}
                >
                  Prescribe Treatment
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <p
                className="text-lg md:text-xl font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                {formatDate(symptom.dateLogged)}
              </p>
              <p
                className="text-sm opacity-50"
                style={{ color: "var(--color-primary)" }}
              >
                {symptom.timeLogged}
              </p>
            </div>
            <div
              className="text-xs font-medium opacity-40"
              style={{ color: "var(--color-primary)" }}
            >
              {getTimeAgo(symptom.dateLogged)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomCard;
