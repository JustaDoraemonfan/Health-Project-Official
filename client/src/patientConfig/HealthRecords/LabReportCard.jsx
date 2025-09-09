import React from "react";
import { FlaskConical } from "lucide-react";
import { getLabStatusBadge } from "../../utils/healthRecordUtils";

const LabReportCard = ({ report }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border google-sans-code-400 border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        <div className="bg-purple-50 p-3 rounded-lg">
          <FlaskConical className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {report.test}
            </h3>
            <span className={getLabStatusBadge(report.status)}>
              {report.status}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{report.results}</p>
          <div className="text-sm text-gray-500">
            {report.date} • Ordered by{" "}
            <span className="font-medium">{report.doctor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportCard;
