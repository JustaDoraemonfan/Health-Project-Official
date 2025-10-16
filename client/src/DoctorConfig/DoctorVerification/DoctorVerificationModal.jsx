import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { doctorAPI } from "../../services/api";

const DoctorVerificationModal = ({ isOpen, onClose, doctorId }) => {
  const [formData, setFormData] = useState({
    nmcRegistrationNumber: "",
    documents: {
      nmcCertificate: null,
      mbbsCertificate: null,
      internshipCertificate: null,
      aadharCard: null,
    },
  });

  const [previews, setPreviews] = useState({
    nmcCertificate: null,
    mbbsCertificate: null,
    internshipCertificate: null,
    aadharCard: null,
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const documentFields = [
    {
      key: "nmcCertificate",
      label: "NMC / State Medical Council Registration Certificate",
      required: true,
    },
    {
      key: "mbbsCertificate",
      label: "MBBS Certificate",
      required: true,
    },
    {
      key: "internshipCertificate",
      label: "MBBS Internship Certificate",
      required: true,
    },
    {
      key: "aadharCard",
      label: "Aadhar Card",
      required: true,
    },
  ];

  const handleFileSelect = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [key]: "Please upload a valid file (JPG, PNG, or PDF)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, [key]: "File size must be less than 5MB" });
      return;
    }

    setFormData({
      ...formData,
      documents: { ...formData.documents, [key]: file },
    });

    setErrors({ ...errors, [key]: null });

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [key]: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setPreviews({ ...previews, [key]: null });
    }
  };

  const handleRemoveFile = (key) => {
    setFormData({
      ...formData,
      documents: { ...formData.documents, [key]: null },
    });
    setPreviews({ ...previews, [key]: null });
    setErrors({ ...errors, [key]: null });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nmcRegistrationNumber.trim()) {
      newErrors.nmcRegistrationNumber = "Registration number is required";
    }

    documentFields.forEach((field) => {
      if (field.required && !formData.documents[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setUploading(true);

      const submitData = new FormData();
      submitData.append(
        "nmcRegistrationNumber",
        formData.nmcRegistrationNumber
      );

      Object.keys(formData.documents).forEach((key) => {
        if (formData.documents[key]) {
          submitData.append(key, formData.documents[key]);
        }
      });
      submitData.append("doctorId", doctorId);

      await doctorAPI.submitDoctorVerification(submitData);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error uploading documents:", err);
      setErrors({
        submit: err.response?.data?.message || "Failed to upload documents",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFormData({
        nmcRegistrationNumber: "",
        documents: {
          nmcCertificate: null,
          mbbsCertificate: null,
          internshipCertificate: null,
          aadharCard: null,
        },
      });
      setPreviews({
        nmcCertificate: null,
        mbbsCertificate: null,
        internshipCertificate: null,
        aadharCard: null,
      });
      setErrors({});
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Apply for Verification
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload your medical credentials and documents
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Verification Request Submitted!
              </h3>
              <p className="text-gray-600">
                Your documents have been uploaded successfully. Our team will
                review them soon.
              </p>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Required Information:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>All documents must be clear and readable</li>
                      <li>Accepted formats: JPG, PNG, or PDF</li>
                      <li>Maximum file size per document: 5MB</li>
                      <li>All fields marked with * are mandatory</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* NMC Registration Number */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NMC / State Medical Council Registration Number *
                </label>
                <input
                  type="text"
                  value={formData.nmcRegistrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nmcRegistrationNumber: e.target.value,
                    })
                  }
                  placeholder="Enter your registration number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={uploading}
                />
                {errors.nmcRegistrationNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.nmcRegistrationNumber}
                  </p>
                )}
              </div>

              {/* Document Upload Fields */}
              <div className="space-y-6">
                {documentFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} {field.required && "*"}
                    </label>

                    {!formData.documents[field.key] ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-gray-50 transition-all">
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG or PDF (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileSelect(field.key, e)}
                          disabled={uploading}
                        />
                      </label>
                    ) : (
                      <div className="border-2 border-emerald-500 rounded-lg p-3 bg-emerald-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {previews[field.key] ? (
                              <img
                                src={previews[field.key]}
                                alt="Preview"
                                className="w-12 h-12 object-cover rounded flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-gray-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {formData.documents[field.key].name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(
                                  formData.documents[field.key].size /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(field.key)}
                            disabled={uploading}
                            className="ml-2 p-2 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    )}

                    {errors[field.key] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading Documents...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Submit for Verification
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVerificationModal;
