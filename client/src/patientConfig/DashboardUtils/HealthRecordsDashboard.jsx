import React, { useState, useEffect } from "react";
import { appointmentAPI, notesAPI, symptomAPI } from "../../services/api";

// Components
import SectionHeader from "../HealthRecords/SectionHeader";
import SectionCard from "../HealthRecords/SectionCard";
import AppointmentCard from "../HealthRecords/AppointmentCard";
import PrescriptionCard from "../HealthRecords/PrescriptionCard";
import SymptomCard from "../HealthRecords/SymptomCard";
import ConsultationNoteCard from "../HealthRecords/ConsultationNoteCard";
import QuickStats from "../HealthRecords/QuickStats";
import SecureFooter from "../HealthRecords/SecureFooter";
import Header from "../../components/Header";

// Constants and Utils
import { sections, prescriptionsData } from "../HealthRecords/constants";
import { filterAppointments } from "../../utils/healthRecordUtils";
import { getPdfUrl } from "../../utils/file";

const HealthRecordsDashboard = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [consultationNotesData, setConsultationNotesData] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [symptom, setSymptom] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointments, symptoms, notes] = await Promise.all([
          appointmentAPI.getUpcomingAppointments(),
          symptomAPI.getSymptoms(),
          notesAPI.getPatientNotes(),
        ]);

        setAppointmentsData(appointments.data.data);
        setSymptom(symptoms.data.data);
        setConsultationNotesData(notes.data.data);
      } catch (error) {
        console.log("Failed to fetch dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredAppointments = filterAppointments(
    appointmentsData,
    appointmentFilter
  );

  const handleDownload = (file) => {
    const link = document.createElement("a");
    const url = getPdfUrl(file.filePath);
    link.href = url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSectionCount = (sectionId) => {
    switch (sectionId) {
      case "appointments":
        return appointmentsData.length;
      case "prescriptions":
        return prescriptionsData.length;
      case "symptom":
        return symptom.length;
      case "consultation-notes":
        return consultationNotesData.length;
      default:
        return 0;
    }
  };

  // Helper function to render the content of the selected section
  const renderSectionContent = () => {
    switch (selectedSection) {
      case "appointments":
        return filteredAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ));
      case "prescriptions":
        return prescriptionsData.map((prescription) => (
          <PrescriptionCard key={prescription.id} prescription={prescription} />
        ));
      case "symptom":
        return symptom.map((symptomItem) => (
          <SymptomCard
            key={symptomItem._id}
            symptom={symptomItem}
            handleDownload={handleDownload}
          />
        ));
      case "consultation-notes":
        return consultationNotesData.map((note) => (
          <ConsultationNoteCard key={note._id} note={note} />
        ));
      default:
        return null; // Or a message like "No section selected"
    }
  };

  // View for when a specific section is selected
  if (selectedSection) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)]">
        <SectionHeader
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          appointmentFilter={appointmentFilter}
          setAppointmentFilter={setAppointmentFilter}
        />
        <div className="px-4 sm:px-6 py-6">
          {/* --- KEY CHANGE HERE --- */}
          {/* This div now creates a responsive multi-column grid for the cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {renderSectionContent()}
          </div>
        </div>
        <SecureFooter />
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-[var(--color-primary)]">
      <Header isNotDashboard={true} />
      <QuickStats
        appointmentsData={appointmentsData}
        prescriptionsData={prescriptionsData}
        symptom={symptom}
        note={consultationNotesData}
      />
      <div className="px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onClick={setSelectedSection}
              count={getSectionCount(section.id)}
            />
          ))}
        </div>
        <SecureFooter isMainView />
      </div>
    </div>
  );
};

export default HealthRecordsDashboard;
