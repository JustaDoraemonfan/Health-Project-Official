// src/components/Profile/UpdateProfile.jsx
import React, { useEffect, useState } from "react";
import { profileAPI } from "../../../services/api";
import { patientAPI } from "../../../services/api";
import { doctorAPI } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { User, Save, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

const UpdateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const navigate = useNavigate();

  // Helper function to convert arrays to strings for display
  const arrayToString = (arr) => {
    if (!arr || !Array.isArray(arr)) return "";
    return arr.join(", ");
  };

  // Helper function to convert strings to arrays for backend
  const stringToArray = (str) => {
    if (!str || typeof str !== "string") return [];
    return str
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        console.log("Profile data:", res.data.data);

        const profileData = res.data.data;
        setProfile(profileData);

        // Transform the data for form display
        const transformedData = {
          ...profileData,
          name: profileData.userId?.name || "",
          email: profileData.userId?.email || "",

          // Transform complex arrays back to strings for textarea display
          medicalHistory:
            profileData.medicalHistory
              ?.map((item) =>
                typeof item === "object" ? item.condition : item
              )
              .join(", ") || "",

          allergies: Array.isArray(profileData.allergies)
            ? profileData.allergies.join(", ")
            : "",

          medications:
            profileData.medications
              ?.map((med) => {
                if (typeof med === "object") {
                  return `${med.name}${med.dosage ? " - " + med.dosage : ""}${
                    med.frequency ? " - " + med.frequency : ""
                  }`;
                }
                return med;
              })
              .join(", ") || "",

          surgeries:
            profileData.surgeries
              ?.map((surgery) => {
                if (typeof surgery === "object") {
                  return `${surgery.name}${
                    surgery.date
                      ? " - " + new Date(surgery.date).toLocaleDateString()
                      : ""
                  }${surgery.hospital ? " - " + surgery.hospital : ""}`;
                }
                return surgery;
              })
              .join(", ") || "",

          // Ensure nested objects exist
          emergencyContact: profileData.emergencyContact || {},
          insurance: profileData.insurance || {},
        };

        setFormData(transformedData);
      } catch (err) {
        console.error("Error fetching profile", err);
        setMessage({ type: "error", content: "Failed to load profile data" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields like emergencyContact.name
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", content: "" });

    try {
      // Prepare data for backend
      let dataToSend = { ...formData };

      // Convert string fields to match schema structure for patient data
      if (profile.userId.role === "patient") {
        // Transform medicalHistory from string to array of objects
        if (formData.medicalHistory) {
          const conditions = stringToArray(formData.medicalHistory);
          dataToSend.medicalHistory = conditions.map((condition) => ({
            condition: condition.trim(),
            diagnosedDate: new Date(),
            status: "ongoing",
          }));
        } else {
          dataToSend.medicalHistory = [];
        }

        // Transform allergies to array of strings (already correct format)
        dataToSend.allergies = formData.allergies
          ? stringToArray(formData.allergies)
          : [];

        // Transform medications from string to array of objects
        if (formData.medications) {
          const meds = stringToArray(formData.medications);
          dataToSend.medications = meds.map((med) => {
            // Parse format like "Medicine Name - 10mg - Twice daily"
            const parts = med.split(" - ");
            return {
              name: parts[0]?.trim() || med.trim(),
              dosage: parts[1]?.trim() || "",
              frequency: parts[2]?.trim() || "",
              prescribedBy: null,
            };
          });
        } else {
          dataToSend.medications = [];
        }

        // Transform surgeries from string to array of objects
        if (formData.surgeries) {
          const surgeries = stringToArray(formData.surgeries);
          dataToSend.surgeries = surgeries.map((surgery) => {
            // Parse format like "Surgery Name - 2020-01-01 - Hospital Name"
            const parts = surgery.split(" - ");
            return {
              name: parts[0]?.trim() || surgery.trim(),
              date: parts[1] ? new Date(parts[1].trim()) : new Date(),
              hospital: parts[2]?.trim() || "",
            };
          });
        } else {
          dataToSend.surgeries = [];
        }

        // Remove user-related fields that shouldn't be updated here
        delete dataToSend.name;
        delete dataToSend.email;
        delete dataToSend.userId;
        delete dataToSend._id;
        delete dataToSend.createdAt;
        delete dataToSend.updatedAt;
        delete dataToSend.__v;

        console.log(
          "Sending patient data:",
          JSON.stringify(dataToSend, null, 2)
        );
        await patientAPI.updatePatient(profile._id, dataToSend);
      } else if (profile.userId.role === "doctor") {
        // Remove user-related fields for doctor too
        delete dataToSend.name;
        delete dataToSend.email;
        delete dataToSend.userId;
        delete dataToSend._id;
        delete dataToSend.createdAt;
        delete dataToSend.updatedAt;
        delete dataToSend.__v;

        console.log("Sending doctor data:", dataToSend);
        await doctorAPI.updateDoctor(profile._id, dataToSend);
      }

      setMessage({ type: "success", content: "Profile updated successfully!" });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      console.error("Error details:", err.response?.data);
      setMessage({
        type: "error",
        content:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen bg-[#161515] py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1e1e1e] rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-300">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No profile found
  if (!profile) {
    return (
      <section className="min-h-screen bg-[#161515] py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1e1e1e] rounded-2xl p-8 border border-gray-700 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl text-gray-300 mb-4">No Profile Found</h2>
              <button
                onClick={handleBack}
                className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#161515] py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-400 hover:text-black mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div className="flex items-center mb-2">
              <User className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-3xl font-bold text-amber-50">
                Update{" "}
                {profile.userId.role?.charAt(0).toUpperCase() +
                  profile.userId.role?.slice(1)}{" "}
                Profile
              </h1>
            </div>
            <p className="text-gray-400">
              Keep your profile information up to date
            </p>
          </div>

          {/* Message Display */}
          {message.content && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center ${
                message.type === "success"
                  ? "bg-green-900/50 border border-green-700 text-green-300"
                  : "bg-red-900/50 border border-red-700 text-red-300"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              )}
              {message.content}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-[#1e1e1e] rounded-2xl p-8 border bg-gradient-to-r from-stone-900 to-slate-900">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Information (Read-only) */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-200 mb-3">
                  User Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name (Account)
                    </label>
                    <div className="px-4 py-3 bg-gray-700/50 rounded-lg text-gray-300">
                      {profile.userId?.name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address (Account)
                    </label>
                    <div className="px-4 py-3 bg-gray-700/50 rounded-lg text-gray-300">
                      {profile.userId?.email || "N/A"}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  To update account information, please contact support.
                </p>
              </div>

              {/* Role-specific Fields */}
              {profile.userId.role === "patient" && (
                <>
                  <h3 className="text-xl font-semibold text-amber-50 mb-4 border-b border-gray-600 pb-2">
                    Patient Profile
                  </h3>

                  {/* Basic Information */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-200 mb-3">
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="age"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Age
                        </label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age || ""}
                          onChange={handleChange}
                          min="1"
                          max="120"
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your age"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="bloodGroup"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Blood Group
                        </label>
                        <select
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select blood group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your city or address"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contactNumber"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          id="contactNumber"
                          name="contactNumber"
                          value={formData.contactNumber || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-200 mb-3">
                      Medical History
                    </h4>
                    <div>
                      <label
                        htmlFor="medicalHistory"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Past Medical Conditions
                        <span className="text-sm text-gray-500 ml-2">
                          (separate multiple items with commas)
                        </span>
                      </label>
                      <textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        value={formData.medicalHistory || ""}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-3 bg-slate-500 border border-gray-600 rounded-lg text-amber-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        placeholder="List previous diagnoses, chronic illnesses, or relevant conditions (separated by commas)"
                      />
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-200 mb-3">
                      Allergies
                    </h4>
                    <div>
                      <label
                        htmlFor="allergies"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Known Allergies
                        <span className="text-sm text-gray-500 ml-2">
                          (separate multiple items with commas)
                        </span>
                      </label>
                      <textarea
                        id="allergies"
                        name="allergies"
                        value={formData.allergies || ""}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-3  bg-slate-500 border border-gray-600 rounded-lg text-amber-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        placeholder="Specify any medication, food, or environmental allergies (separated by commas)"
                      />
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-200 mb-3">
                      Current Medications
                    </h4>
                    <div>
                      <label
                        htmlFor="medications"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Ongoing Medications
                        <span className="text-sm text-gray-500 ml-2">
                          (separate multiple items with commas)
                        </span>
                      </label>
                      <textarea
                        id="medications"
                        name="medications"
                        value={formData.medications || ""}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-3  bg-slate-500 border border-gray-600 rounded-lg text-amber-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        placeholder="List medications with dosage and frequency (separated by commas)"
                      />
                    </div>
                  </div>

                  {/* Surgery History */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-200 mb-3">
                      Surgical History
                    </h4>
                    <div>
                      <label
                        htmlFor="surgeries"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Previous Surgeries
                        <span className="text-sm text-gray-500 ml-2">
                          (separate multiple items with commas)
                        </span>
                      </label>
                      <textarea
                        id="surgeries"
                        name="surgeries"
                        value={formData.surgeries || ""}
                        onChange={handleChange}
                        rows=""
                        className="w-full px-4 py-3  bg-slate-500 border border-gray-600 rounded-lg text-amber-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        placeholder="List surgeries with dates and hospital names (separated by commas)"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-200 mb-3">
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="emergencyContactName"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="emergencyContactName"
                          name="emergencyContact.name"
                          value={formData.emergencyContact?.name || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter contact name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="emergencyContactRelation"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Relationship
                        </label>
                        <input
                          type="text"
                          id="emergencyContactRelation"
                          name="emergencyContact.relation"
                          value={formData.emergencyContact?.relation || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="e.g., Parent, Spouse, Sibling"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="emergencyContactPhone"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="emergencyContactPhone"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact?.phone || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter emergency contact number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Insurance Information */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-200 mb-3">
                      Insurance Information (Optional)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="insuranceProvider"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Provider
                        </label>
                        <input
                          type="text"
                          id="insuranceProvider"
                          name="insurance.provider"
                          value={formData.insurance?.provider || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Provider Name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="insurancePolicyNumber"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Policy Number
                        </label>
                        <input
                          type="text"
                          id="insurancePolicyNumber"
                          name="insurance.policyNumber"
                          value={formData.insurance?.policyNumber || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Policy Number"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="insuranceValidTill"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Valid Until
                        </label>
                        <input
                          type="date"
                          id="insuranceValidTill"
                          name="insurance.validTill"
                          value={
                            formData.insurance?.validTill
                              ? new Date(formData.insurance.validTill)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {profile.userId.role === "doctor" && (
                <>
                  <h3 className="text-xl font-semibold text-black mb-4 border-b border-gray-600 pb-2">
                    Doctor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="specialization"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Specialization
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Cardiology, Neurology"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        value={formData.experience || ""}
                        onChange={handleChange}
                        min="0"
                        max="50"
                        className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Years of experience"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="licenseNumber"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Medical license number"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="biography"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Professional Biography
                    </label>
                    <textarea
                      id="biography"
                      name="biography"
                      value={formData.biography || ""}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-slate-200 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                      placeholder="Brief professional biography, education, achievements, etc."
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-black rounded-lg transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-black rounded-lg transition-colors duration-200 font-medium flex items-center"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateProfile;
