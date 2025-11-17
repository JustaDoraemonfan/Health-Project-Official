import React, { useEffect, useState } from "react";
import {
  User,
  AlertCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { doctorAPI } from "../../../services/api";
import { useUser } from "../../../hooks/useUser";

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
  const { user } = useUser();

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

  const profilePhoto =
    user?.patientProfile?.profilePhoto ||
    user?.doctorProfile?.profilePhoto ||
    null;

  const [open, setOpen] = (false);
  const [doctorStatus, setDoctorStatus] = useState(isAvailable);

  const currentStatus = statusOptions.find((s) => s.label === doctorStatus);

  return (
    <section className="mb-6 sm:mb-8">
      {/* Header - Responsive */}
      <div className="text-center mb-6 sm:mb-10">
        {/* Profile Photo or Default Title */}
        <div className="flex justify-center mb-4">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-blue-400 object-cover shadow-md"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl google-sans-code-400 font-bold text-[var(--color-secondary)] mb-2 sm:mb-3">
              {isDoctor ? "Doctor" : "Patient"}{" "}
              <span className="text-blue-400">Dashboard</span>
            </h1>
          )}
        </div>

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
          <div className="google-sans-code-400">
            {/* Mobile Layout - Stack everything */}
            <div className="flex flex-col gap-3 sm:hidden">
              {/* Top Row: Status */}
              <div className="flex items-center justify-between">
                <div className="relative">
                  {isDoctor ? (
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 focus:outline-none"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          currentStatus?.dot
                        } ${
                          doctorStatus === "available" ? "animate-pulse" : ""
                        }`}
                      />
                      <span
                        className={`${
                          currentStatus?.color || "text-gray-400"
                        } text-xs`}
                      >
                        {doctorStatus}
                      </span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Good</span>
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
                          className={`flex items-center gap-2 px-3 py-2 w-full text-left text-sm hover:bg-stone-700 first:rounded-t-lg last:rounded-b-lg ${status.color}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Alerts on mobile - compact */}
                {isDoctor ? (
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-3 h-3" />
                      <span>5</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>2</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>2</span>
                  </div>
                )}
              </div>

              {/* Bottom Row: Email */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                <User className="w-3 h-3 text-blue-400 flex-shrink-0" />
                <span className="text-slate-50 text-xs truncate">{email}</span>
              </div>
            </div>

            {/* Desktop/Tablet Layout - Horizontal */}
            <div className="hidden sm:flex items-center justify-between gap-4">
              {/* Left section */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Doctor / Patient Status */}
                <div className="relative flex-shrink-0">
                  {isDoctor ? (
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 focus:outline-none"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          currentStatus?.dot
                        } ${
                          doctorStatus === "available" ? "animate-pulse" : ""
                        }`}
                      />
                      <span
                        className={`${
                          currentStatus?.color || "text-gray-400"
                        } text-sm whitespace-nowrap`}
                      >
                        Status: {doctorStatus}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm whitespace-nowrap">
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
                          className={`flex items-center gap-2 px-3 py-2 w-full text-left text-sm hover:bg-stone-700 first:rounded-t-lg last:rounded-b-lg ${status.color}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${status.dot}`}
                          />
                          {status.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Email - Truncated */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-50 text-sm truncate">
                    {email}
                  </span>
                </div>
              </div>

              {/* Right section - Alerts */}
              <div className="flex items-center gap-3 text-sm flex-shrink-0">
                {isDoctor ? (
                  <>
                    <div className="flex items-center gap-2 text-amber-400 whitespace-nowrap">
                      <Clock className="w-4 h-4" />
                      <span>5 pending</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-400 whitespace-nowrap">
                      <AlertTriangle className="w-4 h-4" />
                      <span>2 urgent</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-amber-400 whitespace-nowrap">
                    <AlertCircle className="w-4 h-4" />
                    <span>2 reminders</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
