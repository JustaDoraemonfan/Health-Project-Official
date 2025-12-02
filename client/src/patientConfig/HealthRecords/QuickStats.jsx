import React, { useState } from "react";
import {
  getUpcomingAppointmentsCount,
  getActivePrescriptionsCount,
  getSymptomCount,
  getNotesCount,
} from "../../utils/healthRecordUtils";
import { ChevronDown } from "lucide-react";

const QuickStats = ({ appointmentsData, prescriptionsData, symptom, note }) => {
  const noteCount = getNotesCount(note);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Consolidate stats into an array for easier mapping
  const stats = [
    {
      label: "Upcoming Appointments",
      value: getUpcomingAppointmentsCount(appointmentsData),
      color: "text-blue-600",
    },
    {
      label: "Active Prescriptions",
      value: getActivePrescriptionsCount(prescriptionsData),
      color: "text-green-600",
    },
    {
      label: "Recent Symptom Reports",
      value: getSymptomCount(symptom),
      color: "text-purple-600",
    },
    {
      label: noteCount === 1 ? "Recent Note" : "Recent Notes",
      value: noteCount,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="bg-transparent rounded-2xl spline-sans-mono-400 p-6 md:p-8">
      {/* Mobile Dropdown View: Hidden on 'sm' screens and up */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none shadow-sm"
        >
          <h3 className="text-lg font-medium text-gray-900">Quick Overview</h3>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              isDropdownOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>
        {isDropdownOpen && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <ul className="divide-y divide-gray-200">
              {stats.map((stat, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-4"
                >
                  <span className="text-gray-600">{stat.label}</span>
                  <span className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Grid View: Hidden by default, visible on 'sm' screens and up */}
      <div className="hidden sm:block">
        <h3 className="text-xl flex justify-center font-light text-gray-900 mb-6 md:text-2xl">
          Quick Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
