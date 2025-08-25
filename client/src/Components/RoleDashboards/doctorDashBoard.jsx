import React from "react";

export default function doctorDashBoard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">
        Doctor Dashboard
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">My Patients</h3>
          <p className="text-sm text-gray-600 mb-3">Manage your patient list</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            View Patients
          </button>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Appointments</h3>
          <p className="text-sm text-gray-600 mb-3">Today's schedule</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            View Schedule
          </button>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Consultations</h3>
          <p className="text-sm text-gray-600 mb-3">Start video consultation</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}
