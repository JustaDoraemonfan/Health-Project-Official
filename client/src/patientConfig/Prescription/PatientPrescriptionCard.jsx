import { Calendar, Eye, User } from "lucide-react";

export const PrescriptionCard = ({ prescription, onDownload }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-[var(--color-secondary)]/90 rounded-lg shadow-sm border spline-sans-mono-400 border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
      {/* Main container with responsive flex direction */}
      <div className="flex flex-col sm:flex-row items-start justify-between">
        {/* Doctor's information section */}
        <div className="flex-1 w-full">
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

        {/* Action buttons section with responsive margin and alignment */}
        <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto justify-end">
          <button
            onClick={() => onDownload(prescription)}
            className="flex items-center justify-center gap-2 px-3 py-2 w-full sm:w-auto hover:cursor-pointer text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
            title="View prescription"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
