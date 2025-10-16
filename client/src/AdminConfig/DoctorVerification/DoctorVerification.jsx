import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Bell,
  User,
  ExternalLink,
} from "lucide-react";

const DoctorVerificationDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerificationDocuments = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getPendingVerifications();
        const pendingVerification = response.data.data;
        setDoctors(pendingVerification);
        setError(null);
      } catch (err) {
        setError("Failed to fetch verification documents");
        console.error("Error fetching verifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerificationDocuments();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleAction = (doctor, action) => {
    setSelectedDoctor(doctor);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      // Update the verification status in the backend
      // await adminAPI.updateVerificationStatus(selectedDoctor._id, modalAction);

      // Update local state
      setDoctors(
        doctors.map((doc) =>
          doc._id === selectedDoctor._id
            ? {
                ...doc,
                verification: {
                  ...doc.verification,
                  status: modalAction,
                },
              }
            : doc
        )
      );
      setShowModal(false);
      setSelectedDoctor(null);
      setModalAction(null);
    } catch (err) {
      console.error("Error updating verification status:", err);
      alert("Failed to update verification status");
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doctor.userId.name.toLowerCase().includes(searchLower) ||
      doctor.userId.email.toLowerCase().includes(searchLower) ||
      doctor.specialization.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const openDocument = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 font-semibold mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Doctor Verification
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review and verify pending doctor applications
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} className="text-gray-600" />
              {doctors.filter((d) => d.verification.status === "pending")
                .length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">admin@health.com</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-8 py-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">
                {
                  doctors.filter((d) => d.verification.status === "pending")
                    .length
                }
              </span>{" "}
              pending verification
              {doctors.filter((d) => d.verification.status === "pending")
                .length !== 1
                ? "s"
                : ""}
            </div>
          </div>
        </div>

        {/* Table */}
        <main className="flex-1 overflow-auto px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Verification Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-gray-500">
                        No doctors found matching your search criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {doctor.userId.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {doctor.userId.email}
                          </p>
                          {doctor.location && (
                            <p className="text-xs text-gray-400 mt-1">
                              {doctor.location}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                          {doctor.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {doctor.experience} years
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {doctor.verification?.nmcRegistrationNumber && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-gray-600 mb-1">
                                NMC Registration No.
                              </p>
                              <p className="text-sm font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded inline-block">
                                {doctor.verification.nmcRegistrationNumber}
                              </p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {doctor.verification?.evidence &&
                              Object.entries(doctor.verification.evidence).map(
                                ([key, doc]) => {
                                  if (!doc || !doc.signedUrl) return null;

                                  const labels = {
                                    nmcCertificate: "NMC Certificate",
                                    mbbsCertificate: "MBBS Certificate",
                                    internshipCertificate:
                                      "Internship Certificate",
                                    aadharCard: "Aadhar Card",
                                  };

                                  return (
                                    <button
                                      key={key}
                                      onClick={() =>
                                        openDocument(doc.signedUrl)
                                      }
                                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-xs text-gray-700 transition-colors"
                                    >
                                      <FileText size={14} />
                                      {labels[key] || key}
                                      <ExternalLink size={12} />
                                    </button>
                                  );
                                }
                              )}
                            {(!doctor.verification?.evidence ||
                              Object.keys(doctor.verification.evidence)
                                .length === 0) && (
                              <span className="text-xs text-gray-400">
                                No documents
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(doctor.verification.status)}
                      </td>
                      <td className="px-6 py-4">
                        {doctor.verification.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(doctor, "approved")}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all hover:shadow-md active:scale-95"
                            >
                              <CheckCircle size={16} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(doctor, "rejected")}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all hover:shadow-md active:scale-95"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No action needed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Confirm {modalAction === "approved" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              {modalAction === "approved" ? "approve" : "reject"}{" "}
              <span className="font-semibold">
                {selectedDoctor?.userId?.name}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all hover:shadow-md ${
                  modalAction === "approved"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorVerificationDashboard;
