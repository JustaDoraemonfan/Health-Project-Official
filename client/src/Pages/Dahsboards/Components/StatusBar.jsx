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
    <section>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl google-sans-code-400 font-bold text-gray-100 mb-3">
          {isDoctor ? "Doctor" : "Patient"}{" "}
          <span className="text-blue-400">Dashboard</span>
        </h1>
        <p className="text-slate-50 google-sans-code-400 text-lg mb-1">
          Welcome back, {isDoctor ? "Dr." : ""}{" "}
          <span className="text-green-400">{name}</span>
        </p>
        <p className="text-purple-400 google-sans-code-400 text-sm">
          {isDoctor
            ? `${
                specialization ? `${specialization} • ` : ""
              }Managing patient care with precision`
            : "Manage your healthcare journey from one central location"}
        </p>
      </div>

      {/* Status Bar */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-zinc-900 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between google-sans-code-400">
            {/* Left section */}
            <div className="flex items-center gap-3">
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
                      } text-sm`}
                    >
                      Status: {doctorStatus}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm">
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

              {/* Email */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-slate-50 text-sm">{email}</span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3 text-sm">
              {isDoctor ? (
                <>
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span>5 pending</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>2 urgent</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>2 reminders pending</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
