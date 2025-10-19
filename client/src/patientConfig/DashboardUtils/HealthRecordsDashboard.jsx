import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
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
        const appointments = await appointmentAPI.getUpcomingAppointments();
        setAppointmentsData(appointments.data.data);

        const symptoms = await symptomAPI.getSymptoms();
        setSymptom(symptoms.data.data);

        const notes = await notesAPI.getPatientNotes();
        setConsultationNotesData(notes.data.data);
      } catch (error) {
        console.log(error);
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

  if (selectedSection) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)]">
        <SectionHeader
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          appointmentFilter={appointmentFilter}
          setAppointmentFilter={setAppointmentFilter}
        />

        {/* Responsive padding for content lists */}
        <div className="px-4 sm:px-6 py-6">
          <div className="grid gap-4">
            {selectedSection === "appointments" &&
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}

            {selectedSection === "prescriptions" &&
              prescriptionsData.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                />
              ))}

            {selectedSection === "symptom" &&
              symptom.map((symptom) => (
                <SymptomCard
                  key={symptom._id}
                  symptom={symptom}
                  handleDownload={handleDownload}
                />
              ))}

            {selectedSection === "consultation-notes" &&
              consultationNotesData.map((note) => (
                <ConsultationNoteCard key={note._id} note={note} />
              ))}
          </div>
        </div>

        <SecureFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen google-sans-code-400 bg-[var(--color-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-secondary)]/90 shadow-sm border-b border-gray-200">
        {/* Responsive padding */}
        <div className="px-4 sm:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              {/* Responsive font size */}
              <h1 className="text-2xl sm:text-3xl font-light text-[var(--color-primary)]">
                Health Records
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Manage and view your medical information
              </p>
            </div>
          </div>
        </div>
      </div>
      <QuickStats
        appointmentsData={appointmentsData}
        prescriptionsData={prescriptionsData}
        symptom={symptom}
        note={consultationNotesData}
      />

      {/* Main Content */}
      {/* Responsive padding */}
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
