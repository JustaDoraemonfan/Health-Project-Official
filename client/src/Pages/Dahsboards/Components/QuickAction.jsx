import React from "react";
import {
  Stethoscope,
  ChevronRight,
  CreditCard,
  Phone,
  Pill,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickAction({ role = "patient", actions = null }) {
  const navigate = useNavigate();
  const isDoctor = role === "doctor";

  // Default actions for patients
  const defaultPatientActions = [
    {
      id: "emergency",
      title: "Emergency Contact",
      description: "Call emergency services",
      icon: Stethoscope,
      color: "red",
      onClick: () => console.log("Emergency contact"),
    },
    {
      id: "profile",
      title: "Manage your profile",
      description: "View & update profile details",
      icon: CreditCard,
      color: "blue",
      onClick: () => navigate("/update-profile"),
    },
  ];

  // Default actions for doctors
  const defaultDoctorActions = [
    {
      id: "emergency-protocol",
      title: "Emergency Protocol",
      description: "Rapid response system",
      icon: Phone,
      color: "red",
      onClick: () => console.log("Emergency protocol"),
    },
    {
      id: "quick-prescription",
      title: "Quick Prescription",
      description: "Generate prescriptions",
      icon: Pill,
      color: "green",
      onClick: () => console.log("Quick prescription"),
    },
    {
      id: "patient-lookup",
      title: "Patient Lookup",
      description: "Search patient records",
      icon: UserCheck,
      color: "blue",
      onClick: () => console.log("Patient lookup"),
    },
  ];

  const quickActions =
    actions || (isDoctor ? defaultDoctorActions : defaultPatientActions);

  return (
    <section>
      {/* Quick Actions Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="text-center mb-6">
          <h3 className="text-xl google-sans-code-400 font-semibold text-gray-100 mb-2">
            Quick Actions
          </h3>
          <p className="text-gray-400 google-sans-code-400 text-sm">
            {isDoctor
              ? "Essential tools for efficient patient care"
              : "Frequently used features for faster access"}
          </p>
        </div>

        <div
          className={`grid grid-cols-1 ${
            quickActions.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          } gap-4`}
        >
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`bg-gradient-to-r from-stone-900 to-slate-900 rounded-lg p-4 border border-gray-700 hover:border-${
                action.color === "red"
                  ? "red"
                  : action.color === "green"
                  ? "green"
                  : "blue"
              }-500 transition-all duration-200 transform hover:scale-[1.02] text-left`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-${action.color}-500/20 rounded-lg flex items-center justify-center`}
                  >
                    <action.icon
                      className={`w-5 h-5 text-${action.color}-400`}
                    />
                  </div>
                  <div>
                    <h4 className="text-slate-50 google-sans-code-400 font-semibold text-sm">
                      {action.title}
                    </h4>
                    <p className="text-gray-400 google-sans-code-400 text-xs">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
