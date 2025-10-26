// src/components/Profile/UpdateProfile.jsx
import React, { useEffect, useState } from "react";
import { profileAPI } from "../../services/api";
import { patientAPI } from "../../services/api";
import { doctorAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { User, Save, ArrowLeft, AlertCircle } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import MessageAlert from "../../components/MessageAlert";
import PatientForm from "../PatientFormSections/PatientForm";
import DoctorForm from "../../DoctorConfig/DoctorFormSection/DoctorForm";
import {
  transformProfileData,
  prepareDataForSubmission,
} from "../../utils/dataTransforms";
import {
  transformDoctorProfileData,
  prepareDoctorDataForSubmission,
} from "../../utils/doctorProfileTransform";
import Header from "../../components/Header";

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

        // Transform the data based on user role
        let transformedData;
        if (profileData.userId.role === "patient") {
          transformedData = transformProfileData(profileData);
        } else if (profileData.userId.role === "doctor") {
          transformedData = transformDoctorProfileData(profileData);
        }
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

    // Handle nested fields like emergencyContact.name or insurance.provider
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
      let dataToSend;

      if (profile.userId.role === "patient") {
        dataToSend = prepareDataForSubmission(formData, profile);
        console.log(
          "Sending patient data:",
          JSON.stringify(dataToSend, null, 2)
        );
        await patientAPI.updatePatient(profile._id, dataToSend);
      } else if (profile.userId.role === "doctor") {
        dataToSend = prepareDoctorDataForSubmission(formData, profile);
        console.log(
          "Sending doctor data:",
          JSON.stringify(dataToSend, null, 2)
        );
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
      <section className="min-h-screen bg-[#161515] py-8 px-4">
        <div className="container mx-auto">
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
    <>
      <Header isNotDashboard={true} />
      <section className="min-h-screen google-sans-code-400 bg-[var(--color-primary)] pt-10 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header */}
            <div className="mb-12">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-light text-[var(--color-secondary)] mb-3 tracking-tight">
                  Update{" "}
                  {profile.userId.role?.charAt(0).toUpperCase() +
                    profile.userId.role?.slice(1)}{" "}
                  Profile
                </h1>
                <p className="text-gray-400 text-base sm:text-lg">
                  Keep your profile information up to date for the best
                  experience
                </p>
              </div>
            </div>

            {/* Message Display */}
            <MessageAlert message={message} />

            {/* Enhanced Form Layout */}
            <div className="backdrop-blur-sm bg-transparent rounded-3xl shadow-2xl overflow-hidden">
              {/* Form Header with Gradient */}
              <div className="bg-[var(--color-secondary)] px-4 sm:px-8 py-6 border-b border-slate-600/50">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-blue-400" />
                  </div>
                  Profile Information
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-8">
                {/* User Information Section with Enhanced Design */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-900/50 to-slate-900/50 rounded-2xl blur-sm"></div>
                  <div className="relative bg-gradient-to-r from-stone-900 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-600/40 backdrop-blur-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mr-4">
                        <User className="h-5 w-5 text-emerald-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-slate-100">
                        Account Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300">
                          Full Name (Account)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl blur-sm"></div>
                          <div className="relative px-6 py-4 bg-slate-700/70 rounded-xl text-slate-200 border border-slate-600/50 backdrop-blur-sm font-medium break-words">
                            {profile.userId?.name || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300">
                          Email Address (Account)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl blur-sm"></div>
                          <div className="relative px-6 py-4 bg-slate-700/70 rounded-xl text-slate-200 border border-slate-600/50 backdrop-blur-sm font-medium break-words">
                            {profile.userId?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-600/30">
                      <p className="text-sm text-slate-400 italic flex items-start sm:items-center">
                        <div className="w-4 h-4 bg-amber-500/20 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1 sm:mt-0">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        </div>
                        To update account information, please contact support.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role-specific Forms Container */}
                <div className="relative">
                  <div className="relative bg-transparent rounded-2xl p-0 sm:p-8 backdrop-blur-sm">
                    {profile.userId.role === "patient" && (
                      <PatientForm
                        formData={formData}
                        handleChange={handleChange}
                      />
                    )}

                    {profile.userId.role === "doctor" && (
                      <DoctorForm
                        formData={formData}
                        handleChange={handleChange}
                      />
                    )}
                  </div>
                </div>

                {/* Enhanced Submit Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4 pt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="group w-full sm:w-auto px-8 py-4 bg-slate-600/50 hover:bg-slate-500/50 text-slate-100 rounded-2xl transition-all duration-300 font-medium border border-slate-500/50 hover:border-slate-400/50 backdrop-blur-sm hover:shadow-lg hover:scale-105"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 font-medium border border-blue-500/50 hover:border-blue-400/50 disabled:border-slate-500/50 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 backdrop-blur-sm"
                  >
                    {updating ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span>Updating Profile...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Update Profile</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateProfile;
