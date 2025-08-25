import React from "react";

export default function patientDashboard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        Patient Dashboard
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Book Appointment</h3>
          <p className="text-sm text-gray-600 mb-3">
            Schedule a consultation with a doctor
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Now
          </button>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Medical History</h3>
          <p className="text-sm text-gray-600 mb-3">
            View your past consultations
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
