import { PrescriptionCard } from "./PatientPrescriptionCard";
import { PrescriptionModal } from "./PrescriptionModal";
import React, { useState, useEffect } from "react";
import { Calendar, User, FileText, ChevronDown } from "lucide-react"; // Import ChevronDown
import { prescriptionAPI } from "../../services/api";
import { getPdfUrl } from "../../utils/file"; // ✅ import helper
import Header from "../../components/Header";

export const PatientPrescriptionDashboard = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isStatsVisible, setIsStatsVisible] = useState(false); // State for dropdown

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
    <section>
      <Header isNotDashboard={true} />
      <div className="min-h-screen google-sans-code-400 bg-[var(--color-primary)] pt-20">
        {/* ✅ Use responsive padding: p-4 on mobile, p-6 on larger screens */}
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="mb-8">
            {/* ✅ Use responsive text size: 2xl on mobile, 3xl on larger screens */}
            <h1 className="text-2xl md:text-3xl font-light text-[var(--color-secondary)] mb-2">
              My Prescriptions
            </h1>
            <p className="text-gray-600">
              View and download your medical prescriptions
            </p>
          </div>

          {/* Stats Dropdown */}
          <div className="mb-8">
            <button
              onClick={() => setIsStatsVisible(!isStatsVisible)}
              className="w-full flex justify-between items-center p-4 bg-white/5 rounded-lg text-[var(--color-secondary)] hover:bg-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span className="font-semibold text-lg">View Statistics</span>
              <ChevronDown
                className={`w-6 h-6 transition-transform duration-300 ${
                  isStatsVisible ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isStatsVisible
                  ? "max-h-[500px] opacity-100 pt-6"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Prescriptions */}
                <div className="bg-transparent rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-full">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--color-secondary)]">
                        {prescriptions.length}
                      </p>
                      <p className="text-md text-[var(--color-secondary)]/70">
                        Total Prescriptions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Latest Prescription */}
                <div className="bg-transparent p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Calendar className="w-6 h-6 text-green-800" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--color-secondary)]">
                        {prescriptions.length > 0
                          ? new Date(
                              Math.max(
                                ...prescriptions.map((p) => new Date(p.date))
                              )
                            ).toLocaleDateString("en-US", { month: "short" })
                          : "-"}
                      </p>
                      <p className="text-md text-[var(--color-secondary)]/70">
                        Latest Prescription
                      </p>
                    </div>
                  </div>
                </div>

                {/* Different Doctors */}
                <div className="bg-transparent p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-full">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--color-secondary)]">
                        {new Set(prescriptions.map((p) => p.doctorName)).size}
                      </p>
                      <p className="text-md text-[var(--color-secondary)]/70">
                        {new Set(prescriptions.map((p) => p.doctorName)).size >
                        1
                          ? "Differnent Doctors"
                          : "Doctor"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#FFFDF2] mb-4">
              Recent Prescriptions
            </h2>

            {prescriptions.length === 0 ? (
              <div className="bg-[#FFFDF2] rounded-lg shadow-sm border border-gray-200 p-12 text-center">
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
    </section>
  );
};
