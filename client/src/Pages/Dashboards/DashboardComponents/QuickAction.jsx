import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doctorQuickActions } from "../../../config/doctorDashboardSections";
import { patientQuickActions } from "../../../config/patientDashboardSection";
import { adminQuickActions } from "../../../config/adminDashboardSection";

export default function QuickAction({ role = "patient", actions = null }) {
  const navigate = useNavigate();
  const isDoctor = role === "doctor";

  const quickActions =
    actions ||
    (isDoctor
      ? doctorQuickActions(navigate)
      : role === "admin"
      ? adminQuickActions(navigate)
      : patientQuickActions(navigate));

  return (
    <section>
      {/* Quick Actions Section - Responsive */}
      <div className="max-w-6xl mx-auto mt-8 sm:mt-12">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl spline-sans-mono-400 font-semibold text-[var(--color-secondary)] mb-1 sm:mb-2">
            Quick Actions
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-secondary)]/50 spline-sans-mono-400 px-4">
            {isDoctor
              ? "Essential tools for efficient patient care"
              : "Frequently used features for faster access"}
          </p>
        </div>

        {/* Responsive Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            quickActions.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"
          } gap-3 sm:gap-4`}
        >
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`bg-[var(--color-secondary)] rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-${
                action.color === "red"
                  ? "red"
                  : action.color === "green"
                  ? "green"
                  : "blue"
              }-500 transition-all duration-200 transform hover:scale-[1.02] text-left hover:cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 bg-${action.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <action.icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-${action.color}-400`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-50 spline-sans-mono-400 font-semibold text-xs sm:text-sm truncate">
                      {action.title}
                    </h4>
                    <p className="text-gray-400 spline-sans-mono-400 text-xs line-clamp-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
