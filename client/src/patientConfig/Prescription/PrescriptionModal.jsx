export const PrescriptionModal = ({ prescription, isOpen, onClose }) => {
  if (!isOpen || !prescription) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
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

        {/* PDF Viewer */}
        <div className="flex-1 p-4">
          <div className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={prescription.pdfUrl}
              className="w-full h-full"
              title={`Prescription from ${prescription.doctorName}`}
              style={{ minHeight: "500px" }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Create a temporary link and trigger download
              const link = document.createElement("a");
              link.href = prescription.pdfUrl;
              link.download = `prescription-${prescription.doctorName
                .replace(/\s+/g, "-")
                .toLowerCase()}-${prescription.date}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
