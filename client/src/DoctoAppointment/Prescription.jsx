import React, { useState, useEffect } from "react";
import {
  Upload,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
} from "lucide-react";
import { authAPI, prescriptionAPI, doctorAPI } from "../services/api";
import Toast from "../components/Toast";

const PrescriptionUploadModal = ({ isOpen, onClose }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle modal visibility with smooth transitions
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for transition
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Wait for transition to complete before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const initializeComponent = async () => {
        try {
          const doctor = await authAPI.getCurrentUser();
          setDoctorId(doctor.data._id);

          const assignedPatients = await doctorAPI.getDoctorPatients();
          setPatients(assignedPatients.data.patients);
        } catch (error) {
          console.error("Error initializing component:", error);
          showToast("Error loading data. Please refresh the page.", "error");
        }
      };

      initializeComponent();
    }
  }, [isOpen]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleClose = () => {
    // Reset form state
    setSelectedPatientId("");
    setSelectedFile(null);
    setToast(null);
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";

    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      showToast("Please select a valid PDF file.", "error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatientId) {
      showToast("Please select a patient.", "error");
      return;
    }

    if (!selectedFile) {
      showToast("Please select a PDF file to upload.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await prescriptionAPI.uploadPrescription(
        selectedPatientId,
        selectedFile
      );

      if (response.data.success) {
        showToast(response.data.message, "success");
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast(
        error.message || "Failed to upload prescription. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPatient = patients.find(
    (p) => p.userId._id === selectedPatientId
  );

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 google-sans-code-400">
        <div
          className={`bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out transform ${
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="border-b border-zinc-800 p-6 flex items-center justify-between sticky top-0 bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/10 rounded-lg border border-blue-600/20">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">
                  Upload Prescription
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Upload a prescription PDF for your assigned patients
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Patient Selection */}
            <div className="space-y-3">
              <label
                htmlFor="patient-select"
                className="block text-sm font-medium text-zinc-200"
              >
                Select Patient <span className="text-red-400">*</span>
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <select
                  id="patient-select"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="" className="text-zinc-400">
                    Choose a patient...
                  </option>
                  {patients.map((patient) => (
                    <option
                      key={patient.userId._id}
                      value={patient.userId._id}
                      className="text-zinc-100"
                    >
                      {patient.userId.name} ({patient.userId.email})
                    </option>
                  ))}
                </select>
              </div>

              {selectedPatient && (
                <div className="p-3 bg-blue-950/50 border border-blue-800/50 rounded-lg">
                  <p className="text-sm text-blue-300">
                    Selected:{" "}
                    <span className="font-medium text-blue-100">
                      {selectedPatient.userId.name}
                    </span>
                    <span className="text-zinc-400">
                      {" "}
                      ({selectedPatient.userId.email})
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-200">
                Prescription File (PDF) <span className="text-red-400">*</span>
              </label>

              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-blue-400 bg-blue-950/20"
                    : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center">
                  {selectedFile ? (
                    <>
                      <div className="p-3 bg-green-950/50 border border-green-800/50 rounded-lg mb-4">
                        <FileText className="h-8 w-8 text-green-400" />
                      </div>
                      <p className="text-green-400 font-medium mb-1">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-zinc-400 mb-4">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          const fileInput =
                            document.getElementById("file-input");
                          if (fileInput) fileInput.value = "";
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Remove file
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg mb-4">
                        <Upload className="h-8 w-8 text-zinc-500" />
                      </div>
                      <p className="text-zinc-300 mb-1">
                        Drop your PDF file here or{" "}
                        <span className="text-blue-400 font-medium hover:text-blue-300">
                          click to browse
                        </span>
                      </p>
                      <p className="text-sm text-zinc-500">
                        Only PDF files are accepted
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-zinc-300 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !selectedPatientId || !selectedFile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Upload Prescription
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default PrescriptionUploadModal;
