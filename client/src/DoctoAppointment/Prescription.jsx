import React, { useState, useEffect } from "react";
import {
  Upload,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { authAPI, prescriptionAPI, doctorAPI } from "../services/api";

// const doctorAPI = {
//   getDoctorPatients: async () => [
//     {
//       _id: "68af4adade16c0c7b2365fc1",
//       name: "John Doe",
//       email: "john@example.com",
//     },
//     {
//       _id: "68af4adade16c0c7b2365fc2",
//       name: "Jane Smith",
//       email: "jane@example.com",
//     },
//     {
//       _id: "68af4adade16c0c7b2365fc3",
//       name: "Bob Johnson",
//       email: "bob@example.com",
//     },
//   ],
// };

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  );
};

const PrescriptionUpload = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Get current doctor
        const doctor = await authAPI.getCurrentUser();
        setDoctorId(doctor.data._id);

        // Get assigned patients
        const assignedPatients = await doctorAPI.getDoctorPatients();
        setPatients(assignedPatients.data.patients);
      } catch (error) {
        console.error("Error initializing component:", error);
        showToast("Error loading data. Please refresh the page.", "error");
      }
    };

    initializeComponent();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
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
      // Upload prescription
      const response = await prescriptionAPI.uploadPrescription(
        selectedPatientId,
        selectedFile
      );

      if (response.data.success) {
        showToast(response.data.message, "success");
        // Reset form
        setSelectedPatientId("");
        setSelectedFile(null);
        // Reset file input - using ref would be better in real implementation
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="text-blue-600" />
          Upload Prescription
        </h2>
        <p className="text-gray-600 mt-1">
          Upload a prescription PDF for your assigned patients
        </p>
      </div>

      <div className="space-y-6">
        {/* Patient Selection */}
        <div>
          <label
            htmlFor="patient-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Patient *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              id="patient-select"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a patient...</option>
              {patients.map((patient) => (
                <option key={patient.userId._id} value={patient.userId._id}>
                  {patient.userId.name} ({patient.userId.email})
                </option>
              ))}
            </select>
          </div>
          {selectedPatient && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                Selected: <strong>{selectedPatient.userId.name}</strong> (
                {selectedPatient.userId.email})
              </p>
            </div>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prescription File (PDF) *
          </label>

          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
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
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-green-600 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      const fileInput = document.getElementById("file-input");
                      if (fileInput) fileInput.value = "";
                    }}
                    className="text-sm text-red-600 hover:text-red-800 mt-2"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600">
                    Drop your PDF file here or{" "}
                    <span className="text-blue-600 font-medium">
                      click to browse
                    </span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Only PDF files are accepted
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedPatientId || !selectedFile}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
  );
};

export default PrescriptionUpload;
