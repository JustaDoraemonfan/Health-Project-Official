import React from "react";

export default function adminDashborad() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-red-700">
        Admin Dashboard
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">User Management</h3>
          <p className="text-sm text-gray-600 mb-3">Manage all users</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Manage Users
          </button>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">System Reports</h3>
          <p className="text-sm text-gray-600 mb-3">View system analytics</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            View Reports
          </button>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Settings</h3>
          <p className="text-sm text-gray-600 mb-3">System configuration</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
