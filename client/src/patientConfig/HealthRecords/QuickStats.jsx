import React from "react";
import {
  getUpcomingAppointmentsCount,
  getActivePrescriptionsCount,
  getRecentLabReportsCount,
} from "../../utils/healthRecordUtils";

const QuickStats = ({
  appointmentsData,
  prescriptionsData,
  labReportsData,
}) => {
  return (
    <div className=" bg-transparent rounded-2xl google-sans-code-400  p-8">
      <h3 className="text-2xl flex justify-center font-light text-gray-900 mb-6">
        Quick Overview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {getUpcomingAppointmentsCount(appointmentsData)}
          </div>
          <div className="text-gray-600">Upcoming Appointments</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {getActivePrescriptionsCount(prescriptionsData)}
          </div>
          <div className="text-gray-600">Active Prescriptions</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {getRecentLabReportsCount(labReportsData)}
          </div>
          <div className="text-gray-600">Recent Lab Reports</div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
