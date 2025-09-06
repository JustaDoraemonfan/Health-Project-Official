import { Calendar, Download, Eye, User } from "lucide-react";

export const PrescriptionCard = ({ prescription, onView, onDownload }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-[var(--color-secondary)]/90 rounded-lg shadow-sm border google-sans-code-400 border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-light text-[var(--color-primary)]">
                {prescription.doctorName}
              </h3>
              <p className="text-sm text-[var(--color-primary)]/60">
                {prescription.doctorEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-[var(--color-primary)] mt-3">
            <Calendar className="w-4 h-4" />
            <span>Issued on {formatDate(prescription.date)}</span>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onView(prescription)}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            title="View prescription"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View</span>
          </button>

          <button
            onClick={() => onDownload(prescription)}
            className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
            title="Download prescription"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
