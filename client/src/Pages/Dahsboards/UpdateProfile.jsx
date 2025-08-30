// src/components/Profile/UpdateProfile.jsx
import React, { useEffect, useState } from "react";
import { profileAPI } from "../../services/api";
import { patientAPI } from "../../services/api";
import { doctorAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { User, Save, ArrowLeft, AlertCircle } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import MessageAlert from "../../components/MessageAlert";
import PatientForm from "../../components/PatientForm";
import DoctorForm from "../../components/DoctorForm";
import {
  transformProfileData,
  prepareDataForSubmission,
} from "../../utils/dataTransforms";

const UpdateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const navigate = useNavigate();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        console.log("Profile data:", res.data.data);

        const profileData = res.data.data;
        setProfile(profileData);

        // Transform the data for form display
        const transformedData = transformProfileData(profileData);
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
      const dataToSend = prepareDataForSubmission(formData, profile);

      if (profile.userId.role === "patient") {
        console.log(
          "Sending patient data:",
          JSON.stringify(dataToSend, null, 2)
        );
        await patientAPI.updatePatient(profile._id, dataToSend);
      } else if (profile.userId.role === "doctor") {
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
    return <LoadingSpinner />;
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
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
    <section className="min-h-screen font-mono bg-[#161515] py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors duration-200"
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
          <MessageAlert message={message} />

          {/* Form Card */}
          <div className="bg-slate-700 rounded-2xl p-8 border border-slate-700 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Information (Read-only) */}
              <div className="mb-6 p-6  bg-gradient-to-r from-stone-900 to-slate-900 rounded-xl border border-slate-600/40">
                <h4 className="text-xl font-semibold text-slate-100 mb-4">
                  User Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name (Account)
                    </label>
                    <div className="px-4 py-3 bg-slate-700 rounded-lg text-slate-200 border border-slate-600">
                      {profile.userId?.name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address (Account)
                    </label>
                    <div className="px-4 py-3 bg-slate-700 rounded-lg text-slate-200 border border-slate-600">
                      {profile.userId?.email || "N/A"}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-4 italic">
                  To update account information, please contact support.
                </p>
              </div>

              {/* Role-specific Forms */}
              {profile.userId.role === "patient" && (
                <PatientForm formData={formData} handleChange={handleChange} />
              )}

              {profile.userId.role === "doctor" && (
                <DoctorForm formData={formData} handleChange={handleChange} />
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-slate-700">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-slate-100 rounded-xl transition-colors duration-200 font-medium border border-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 font-medium flex items-center border border-blue-500 hover:border-blue-400 disabled:border-slate-500"
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
