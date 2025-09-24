import React, { useState, useEffect } from "react";
import { symptomAPI, doctorAPI } from "../../services/api";

const DoctorSymptomPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const assignedPatientResponse = await doctorAPI.getDoctorPatients();
        const assignedPatients = assignedPatientResponse.data.patients || [];

        // Map API response to component structure
        const patientsWithDefaults = assignedPatients.map((patient) => ({
          ...patient,
          // Map nested user data
          name: patient.userId?.name || "Unknown Patient",
          email: patient.userId?.email || "",
          // Set defaults for missing fields
          symptomsCount: patient.symptoms?.length || 0,
          status: patient.status || "active",
          lastVisit: patient.createdAt || new Date().toISOString(),
        }));

        setPatients(patientsWithDefaults);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePatientClick = async (patient) => {
    try {
      setLoading(true);
      setSelectedPatient(patient);

      const symptomResponse = await symptomAPI.getSymptomForDoctor(
        patient.userId._id
      );
      const symptomsData = symptomResponse.data.data || [];
      console.log(symptomsData);

      // Map API response to component structure
      const symptomsWithDefaults = symptomsData.map((symptom) => ({
        ...symptom,
        // Use _id as id for React key
        id: symptom._id,
        // Map severity to priority (convert to lowercase for consistency)
        priority: symptom.severity ? symptom.severity.toLowerCase() : "medium",
        // Map description field
        symptomDescription: symptom.description || "No description available",
        // Generate timeLogged from createdAt
        timeLogged: symptom.createdAt
          ? new Date(symptom.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "N/A",
        // Use createdAt as dateLogged if onsetDate not available
        dateLogged:
          symptom.onsetDate || symptom.createdAt || new Date().toISOString(),
      }));

      setSymptoms(symptomsWithDefaults);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPatients = () => {
    setSelectedPatient(null);
    setSymptoms([]);
    setSelectedSymptom(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityIndicator = (priority) => {
    const normalizedPriority = priority?.toLowerCase();
    const opacity =
      normalizedPriority === "severe" || normalizedPriority === "high"
        ? 1
        : normalizedPriority === "moderate" || normalizedPriority === "medium"
        ? 0.6
        : 0.3;
    return (
      <div
        className="w-1 h-8 rounded-full"
        style={{ backgroundColor: "var(--color-secondary)", opacity }}
      ></div>
    );
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading && !selectedPatient) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "var(--color-secondary)" }}
          ></div>
          <p
            className="text-lg font-medium"
            style={{ color: "var(--color-secondary)" }}
          >
            Loading patients...
          </p>
        </div>
      </div>
    );
  }

  // Show patient symptoms view
  if (selectedPatient) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {/* Header with back button */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
          <div className="relative px-4 py-8 md:px-6 md:py-12 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleBackToPatients}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/20 hover:shadow-md transition-all duration-200"
                  style={{ color: "var(--color-secondary)" }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Patients
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1
                    className="text-3xl md:text-4xl lg:text-5xl font-light mb-2 tracking-tight"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    {selectedPatient.name}'s Symptoms
                  </h1>
                  <p
                    className="text-lg md:text-xl font-light opacity-60"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    {symptoms.length} active symptom
                    {symptoms.length !== 1 ? "s" : ""} reported
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {selectedPatient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="text-right">
                    <p
                      className="text-lg font-medium"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      Age {selectedPatient.age || "N/A"}
                    </p>
                    <p
                      className="text-sm opacity-50"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      Joined: {formatDate(selectedPatient.lastVisit)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading state for symptoms */}
        {loading && (
          <div className="px-4 pb-12 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center py-16">
              <div
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: "var(--color-secondary)" }}
              ></div>
              <p
                className="text-lg font-medium opacity-60"
                style={{ color: "var(--color-secondary)" }}
              >
                Loading symptoms...
              </p>
            </div>
          </div>
        )}

        {/* Symptoms List */}
        {!loading && (
          <div className="px-4 pb-12 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {symptoms.length === 0 ? (
                <div className="text-center py-16">
                  <p
                    className="text-xl font-light opacity-60"
                    style={{ color: "var(--color-secondary)" }}
                  >
                    No symptoms reported yet
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:gap-4">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className={`group relative border border-black/10 rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl ${
                        selectedSymptom === symptom.id
                          ? "shadow-xl scale-[1.02]"
                          : "hover:shadow-lg"
                      }`}
                      style={{ backgroundColor: "var(--color-primary)" }}
                      onClick={() =>
                        setSelectedSymptom(
                          selectedSymptom === symptom.id ? null : symptom.id
                        )
                      }
                    >
                      <div
                        className="absolute top-0 left-6 w-12 h-0.5 rounded-full"
                        style={{
                          backgroundColor: "var(--color-secondary)",
                          opacity:
                            symptom.priority === "severe" ||
                            symptom.priority === "high"
                              ? 1
                              : symptom.priority === "moderate" ||
                                symptom.priority === "medium"
                              ? 0.6
                              : 0.3,
                        }}
                      ></div>

                      <div className="p-6 md:p-8">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex items-center gap-2">
                                {getPriorityIndicator(symptom.priority)}
                                <span
                                  className="text-sm font-medium opacity-60"
                                  style={{ color: "var(--color-secondary)" }}
                                >
                                  {symptom.priority || "medium"} severity
                                </span>
                                {symptom.category && (
                                  <>
                                    <span className="text-sm opacity-30">
                                      •
                                    </span>
                                    <span
                                      className="text-sm font-medium opacity-60 capitalize"
                                      style={{
                                        color: "var(--color-secondary)",
                                      }}
                                    >
                                      {symptom.category}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="mb-6">
                              <p
                                className={`text-base md:text-lg leading-relaxed transition-all duration-300 ${
                                  selectedSymptom === symptom.id
                                    ? ""
                                    : "line-clamp-2"
                                }`}
                                style={{ color: "var(--color-secondary)" }}
                              >
                                {symptom.symptomDescription}
                              </p>
                              {selectedSymptom !== symptom.id &&
                                symptom.symptomDescription.length > 100 && (
                                  <button className="text-sm font-medium mt-2 opacity-60 hover:opacity-100 transition-opacity">
                                    Read more...
                                  </button>
                                )}

                              {/* Show notes when expanded */}
                              {selectedSymptom === symptom.id &&
                                symptom.notes && (
                                  <div className="mt-4 p-4 bg-black/5 rounded-lg">
                                    <p
                                      className="text-sm font-medium opacity-70 mb-1"
                                      style={{
                                        color: "var(--color-secondary)",
                                      }}
                                    >
                                      Patient Notes:
                                    </p>
                                    <p
                                      className="text-sm opacity-80"
                                      style={{
                                        color: "var(--color-secondary)",
                                      }}
                                    >
                                      {symptom.notes}
                                    </p>
                                  </div>
                                )}
                            </div>

                            {selectedSymptom === symptom.id && (
                              <div className="flex flex-wrap gap-3 mb-4 animate-in slide-in-from-top-2 duration-300">
                                <button
                                  className="px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                  style={{
                                    color: "var(--color-secondary)",
                                    borderColor: "var(--color-secondary)",
                                  }}
                                >
                                  View History
                                </button>
                                <button
                                  className="px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                  style={{
                                    backgroundColor: "var(--color-secondary)",
                                    color: "var(--color-primary)",
                                  }}
                                >
                                  Add Notes
                                </button>
                                <button
                                  className="px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                  style={{
                                    color: "var(--color-secondary)",
                                    borderColor: "var(--color-secondary)",
                                  }}
                                >
                                  Prescribe Treatment
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className="text-right">
                              <p
                                className="text-lg md:text-xl font-medium"
                                style={{ color: "var(--color-secondary)" }}
                              >
                                {formatDate(symptom.dateLogged)}
                              </p>
                              <p
                                className="text-sm opacity-50"
                                style={{ color: "var(--color-secondary)" }}
                              >
                                {symptom.timeLogged}
                              </p>
                            </div>
                            <div
                              className="text-xs font-medium opacity-40"
                              style={{ color: "var(--color-secondary)" }}
                            >
                              {getTimeAgo(symptom.dateLogged)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show patients list view
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"></div>
        <div className="relative px-4 py-8 md:px-6 md:py-12 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-light mb-2 tracking-tight"
                  style={{ color: "var(--color-secondary)" }}
                >
                  My Patients
                </h1>
                <p
                  className="text-lg md:text-xl font-light opacity-60"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {patients.length} assigned patient
                  {patients.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="px-4 pb-12 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-3 md:gap-4">
            {patients.map((patient) => (
              <div
                key={patient._id}
                className="group relative border border-black/10 rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: "var(--color-primary)" }}
                onClick={() => handlePatientClick(patient)}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium"
                        style={{
                          backgroundColor: "var(--color-secondary)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3
                          className="text-xl md:text-2xl font-medium mb-1"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          {patient.name}
                        </h3>
                        <div
                          className="flex items-center gap-4 text-sm opacity-60"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          <span>Age {patient.age || "N/A"}</span>
                          <span>•</span>
                          <span>
                            {patient.gender
                              ? `${
                                  patient.gender.charAt(0).toUpperCase() +
                                  patient.gender.slice(1)
                                }`
                              : "N/A"}
                          </span>
                          <span>•</span>
                          <span>Joined: {formatDate(patient.lastVisit)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p
                          className="text-2xl font-bold"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          {patient.appointments?.length || 0}
                        </p>
                        <p
                          className="text-sm opacity-50"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          Appointments
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            patient.status === "active" ? "" : "opacity-40"
                          }`}
                          style={{ backgroundColor: "var(--color-secondary)" }}
                        ></div>
                        <span
                          className="text-sm font-medium opacity-60"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          {patient.status || "active"}
                        </span>
                      </div>

                      <svg
                        className="w-6 h-6 opacity-40 group-hover:opacity-80 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: "var(--color-secondary)" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/10">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-secondary)" }}
              ></div>
              <p
                className="text-sm font-medium opacity-60"
                style={{ color: "var(--color-secondary)" }}
              >
                All patients loaded
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSymptomPage;
