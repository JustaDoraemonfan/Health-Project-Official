import { Download, FileText, X } from "lucide-react";

export const PrescriptionModal = ({ prescription, isOpen, onClose }) => {
  if (!isOpen || !prescription) return null;

  // Function to handle the download logic
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = prescription.pdfUrl;
    link.download = `prescription-${prescription.doctorName
      .replace(/\s+/g, "-")
      .toLowerCase()}-${prescription.date}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      {/* Modal Panel */}
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col transition-transform duration-300 ease-in-out scale-95 animate-fade-in-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              {/* ✅ Responsive text size */}
              <h2 className="text-md sm:text-lg font-semibold text-gray-900">
                Prescription from {prescription.doctorName}
              </h2>
              <p className="text-sm text-gray-500">
                {prescription.doctorEmail}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ✅ PDF Viewer: This section is now fully flexible */}
        <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
          <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={prescription.pdfUrl}
              className="w-full h-full"
              title={`Prescription from ${prescription.doctorName}`}
            />
          </div>
        </div>

        {/* ✅ Modal Footer: Buttons now stack on mobile */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50/50 rounded-b-xl flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
