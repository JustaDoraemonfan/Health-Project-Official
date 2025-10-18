import React, { useState } from "react";
import {
  User,
  AlertCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { doctorAPI } from "../../../services/api";

export default function StatusBar({
  name,
  email,
  role = "patient",
  specialization = null,
  isAvailable = "Available",
  id = "",
  verificationStatus = "unverified",
}) {
  const isDoctor = role === "doctor";

  const statusOptions = [
    {
      value: "available",
      label: "Available",
      color: "text-green-400",
      dot: "bg-green-400",
    },
    {
      label: "Busy",
      color: "text-amber-400",
      dot: "bg-amber-400",
    },
    {
      label: "In Surgery",
      color: "text-red-400",
      dot: "bg-red-400",
    },
    {
      label: "On Break",
      color: "text-blue-400",
      dot: "bg-blue-400",
    },
    {
      label: "Offline",
      color: "text-gray-400",
      dot: "bg-gray-400",
    },
  ];

  const [open, setOpen] = useState(false);
  const [doctorStatus, setDoctorStatus] = useState(isAvailable);

  const currentStatus = statusOptions.find((s) => s.label === doctorStatus);

  return (
    <section className="mb-6 sm:mb-8">
      {/* Header - Responsive */}
      <div className="text-center mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl google-sans-code-400 font-bold text-[var(--color-secondary)] mb-2 sm:mb-3">
          {isDoctor ? "Doctor" : "Patient"}{" "}
          <span className="text-blue-400">Dashboard</span>
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-[var(--color-secondary)]/50 google-sans-code-400 mb-1 px-4">
          Welcome back, {isDoctor ? "Dr." : ""}{" "}
          <span className="text-red-400">{name}</span>
          {isDoctor && (
            <span
              className={`ml-2 text-xs font-semibold px-2 py-1 rounded ${
                verificationStatus === "verified"
                  ? "bg-green-500/20 text-green-400"
                  : verificationStatus === "pending"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : verificationStatus === "rejected"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {verificationStatus === "verified"
                ? "✓ Verified"
                : verificationStatus === "pending"
                ? "⏳ Pending"
                : verificationStatus === "rejected"
                ? "✗ Rejected"
                : "● Unverified"}
            </span>
          )}
        </p>
        <p className="text-xs sm:text-sm text-purple-400 google-sans-code-400 px-4">
          {isDoctor
            ? `${
                specialization ? `${specialization} • ` : ""
              }Managing patient care with precision`
            : "Manage your healthcare journey from one central location"}
        </p>
      </div>

      {/* Status Bar - Responsive */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-[var(--color-secondary)] rounded-lg sm:rounded-xl p-3 sm:p-5 border border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 google-sans-code-400">
            {/* Left section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Doctor / Patient Status */}
              <div className="relative">
                {isDoctor ? (
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        currentStatus?.dot
                      } ${doctorStatus === "available" ? "animate-pulse" : ""}`}
                    />
                    <span
                      className={`${
                        currentStatus?.color || "text-gray-400"
                      } text-xs sm:text-sm`}
                    >
                      Status: {doctorStatus}
                    </span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-xs sm:text-sm">
                      Health Status: Good
                    </span>
                  </div>
                )}

                {/* Dropdown menu */}
                {isDoctor && open && (
                  <div className="absolute mt-2 w-44 bg-stone-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={async () => {
                          setDoctorStatus(status.label);
                          await doctorAPI.updateDoctor(id, {
                            isAvailable: status.label,
                          });
                          setOpen(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 w-full text-left text-sm hover:bg-stone-700 ${status.color}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                        {status.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Email - Truncated on mobile */}
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-50 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">
                  {email}
                </span>
              </div>
            </div>

            {/* Right section - Stack on mobile */}
          </div>
        </div>
      </div>
    </section>
  );
}
