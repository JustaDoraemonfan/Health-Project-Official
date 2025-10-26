// File: components/doctor/DoctorSymptomPage.js
import React, { useState, useEffect } from "react";
import { symptomAPI, doctorAPI } from "../../services/api";
import PatientsList from "../SymptomTrack/PatientsList";
import PatientSymptoms from "../SymptomTrack/PatientSymptoms";
import LoadingSpinner from "../../components/LoadingSpinner";
import Header from "../../components/Header";

const DoctorSymptomPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const assignedPatientResponse = await doctorAPI.getDoctorPatients();
      const assignedPatients = assignedPatientResponse.data.patients || [];

      const patientsWithDefaults = assignedPatients.map((patient) => ({
        ...patient,
        name: patient.userId?.name || "Unknown Patient",
        email: patient.userId?.email || "",
        symptomsCount: patient.symptoms?.length || 0,
        status: patient.status || "active",
        lastVisit: patient.createdAt || new Date().toISOString(),
      }));
      console.log(patientsWithDefaults);

      setPatients(patientsWithDefaults);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = async (patient) => {
    try {
      setLoading(true);
      setSelectedPatient(patient);

      const symptomResponse = await symptomAPI.getSymptomForDoctor(
        patient.userId._id
      );
      const symptomsData = symptomResponse.data.data || [];

      const symptomsWithDefaults = symptomsData.map((symptom) => ({
        ...symptom,
        id: symptom._id,
        priority: symptom.severity ? symptom.severity.toLowerCase() : "medium",
        symptomDescription: symptom.description || "No description available",
        timeLogged: symptom.createdAt
          ? new Date(symptom.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "N/A",
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
  };

  if (loading && !selectedPatient) {
    return <LoadingSpinner message="Loading patients..." />;
  }

  if (selectedPatient) {
    return (
      <PatientSymptoms
        patient={selectedPatient}
        symptoms={symptoms}
        loading={loading}
        onBack={handleBackToPatients}
      />
    );
  }

  return (
    <>
      <Header />
      <div className="pt-20">
        <PatientsList patients={patients} onPatientClick={handlePatientClick} />
      </div>
    </>
  );
};

export default DoctorSymptomPage;
