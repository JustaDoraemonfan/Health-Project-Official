import React from "react";

export default function fwlDashboard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-purple-700">
        Frontline Worker Dashboard
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Patient Registration</h3>
          <p className="text-sm text-gray-600 mb-3">Register new patients</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Register Patient
          </button>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Health Screening</h3>
          <p className="text-sm text-gray-600 mb-3">
            Conduct basic health checks
          </p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Start Screening
          </button>
        </div>
      </div>
    </div>
  );
}
