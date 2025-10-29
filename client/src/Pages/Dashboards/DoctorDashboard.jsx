import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardComponents/dashboardCard";
import StatusBar from "./DashboardComponents/StatusBar";
import QuickAction from "./DashboardComponents/QuickAction";
import { dashboardAPI, doctorAPI } from "../../services/api";
import PrescriptionUploadModal from "../../DoctorConfig/Prescription/Prescription";
import DoctorVerificationModal from "../../DoctorConfig/DoctorVerification/DoctorVerificationModal";
import { doctorDashboardSections } from "../../config/doctorDashboardSections";
import Footer from "./DashboardComponents/Footer";
import Header from "../../components/Header";
import PopupProfileUpdate from "../../DoctorConfig/DoctorVerification/Popup";
const DoctorDashboard = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  // Updated click handler
  const handleVerificationClick = () => {
    if (!doctor?.profileUpdated) {
      setShowProfilePopup(true);
      return;
    }
    setIsVerificationModalOpen(true);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await dashboardAPI.getDoctorDashboard();
        const data = response.data.data;
        const response2 = await doctorAPI.getDoctor(data.doctor.id);
        const doctorInfo = response2.data.data;

        console.log("Doctor dashboard data:", data);
        console.log("Doctor:", doctorInfo);

        setUser(data.user);
        setDoctor(doctorInfo);
      } catch (err) {
        console.error("Failed to fetch doctor stats:", err);
        setError(err.message);

        setUser({
          id: "doc001",
          name: "Dr. Sarah Johnson",
          email: "dr.johnson@hospital.com",
          role: "doctor",
        });
        setDoctor({
          specialization: "Cardiologist",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const sections = doctorDashboardSections(navigate, () =>
    setIsUploadModalOpen(true)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161515] flex items-center justify-center">
        <div className="text-white text-xl google-sans-code-400">
          Loading doctor dashboard...
        </div>
      </div>
    );
  }

  if (error && !user.name) {
    return (
      <div className="min-h-screen bg-[#161515] flex items-center justify-center">
        <div className="text-red-400 text-xl google-sans-code-400">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  // Check verification status
  const verificationStatus = doctor?.verification?.status;

  return (
    <>
      <Header />
      <section className="min-h-screen google-sans-code-400 bg-[var(--color-primary)] py-8 pt-20">
        <div className="container mx-auto px-6">
          {verificationStatus !== "verified" &&
            (() => {
              // Determine styles based on "rejected" status
              const isRejected = verificationStatus === "rejected";
              const bgColor = isRejected ? "bg-red-50" : "bg-yellow-50";
              const borderColor = isRejected
                ? "border-red-400"
                : "border-yellow-400";
              const iconColor = isRejected ? "text-red-400" : "text-yellow-400";
              const textColor = isRejected ? "text-red-800" : "text-yellow-800";
              const buttonBg = isRejected ? "bg-red-400" : "bg-yellow-400";
              const buttonHoverBg = isRejected
                ? "hover:bg-red-500"
                : "hover:bg-yellow-500";
              const buttonTextColor = isRejected
                ? "text-red-900"
                : "text-yellow-900";
              const text = isRejected
                ? "Your verification was rejected. Please submit new documents."
                : "Your account is not verified yet. Please submit your documents for verification.";
              const buttonText = isRejected
                ? "Re-submit Documents"
                : "Verify Account";

              return (
                <div className="max-w-6xl mx-auto mb-6">
                  <div
                    className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-r-lg shadow-sm`}
                  >
                    {/* Stacks on mobile, row on sm+ */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <svg
                            className={`h-5 w-5 ${iconColor}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${textColor}`}>
                            {text}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleVerificationClick}
                        className={`w-full sm:w-auto flex-shrink-0 px-4 py-2 ${buttonBg} ${buttonHoverBg} ${buttonTextColor} rounded-lg text-sm font-semibold transition-colors shadow-sm`}
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Verified Status */}
          {verificationStatus === "verified" && (
            <div className="max-w-6xl mx-auto mb-6">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    Your account is verified! You can now access all features.
                  </p>
                </div>
              </div>
            </div>
          )}

          <StatusBar
            name={user.name}
            email={user.email}
            role="doctor"
            specialization={doctor.specialization}
            isAvailable={doctor.isAvailable}
            id={doctor._id}
            verificationStatus={verificationStatus}
          />

          {/* This grid is already perfectly responsive */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <DashboardCard
                  key={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  color={section.color}
                  onClick={section.onClick}
                  badge={section.badge}
                  stats={section.stats}
                />
              ))}
            </div>
          </div>

          <QuickAction role="doctor" />
          <Footer role="doctor" />
        </div>
      </section>

      <PrescriptionUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Add Verification Modal */}
      {doctor.profileUpdated == true && (
        <DoctorVerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          doctor={doctor}
        />
      )}
      {showProfilePopup && (
        <PopupProfileUpdate onClose={() => setShowProfilePopup(false)} />
      )}
    </>
  );
};

export default DoctorDashboard;
