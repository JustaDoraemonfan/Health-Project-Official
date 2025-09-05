import { PrescriptionCard } from "./PatientPrescriptionCard";
import { PrescriptionModal } from "./PrescriptionModal";
import React, { useState, useEffect } from "react";
import { Calendar, User, FileText } from "lucide-react";
import { prescriptionAPI } from "../../services/api";
import { getPdfUrl } from "../../utils/file"; // ✅ import helper

export const PatientPrescriptionDashboard = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await prescriptionAPI.getMyPrescriptions();

        // ✅ Attach pdfUrl to each prescription
        const prescriptionsWithUrls = res.data.data.map((p) => ({
          ...p,
          pdfUrl: getPdfUrl(p.filePath),
          doctorName: p.doctorId?.name || "Unknown Doctor",
          doctorEmail: p.doctorId?.email || "doctor@healthyMe.com",
          date: new Date(p.createdAt).toISOString().split("T")[0], // YYYY-MM-DD
        }));

        setPrescriptions(prescriptionsWithUrls);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };
    fetchPrescriptions();
  }, []);

  const handleView = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleDownload = (prescription) => {
    const link = document.createElement("a");
    link.href = prescription.pdfUrl;
    link.download = `prescription-${prescription.doctorName
      .replace(/\s+/g, "-")
      .toLowerCase()}-${prescription.date}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Prescriptions
          </h1>
          <p className="text-gray-600">
            View and download your medical prescriptions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.length}
                </p>
                <p className="text-sm text-gray-500">Total Prescriptions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.length > 0
                    ? new Date(
                        Math.max(...prescriptions.map((p) => new Date(p.date)))
                      ).toLocaleDateString("en-US", { month: "short" })
                    : "-"}
                </p>
                <p className="text-sm text-gray-500">Latest Prescription</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-full">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(prescriptions.map((p) => p.doctorName)).size}
                </p>
                <p className="text-sm text-gray-500">
                  {new Set(prescriptions.map((p) => p.doctorName)).size > 1
                    ? "Differnent Doctors"
                    : "Doctor"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Prescriptions
          </h2>

          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No prescriptions found
              </h3>
              <p className="text-gray-500">
                Your prescriptions will appear here once they are issued.
              </p>
            </div>
          ) : (
            prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription._id}
                prescription={prescription}
                onView={handleView}
                onDownload={handleDownload}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};
