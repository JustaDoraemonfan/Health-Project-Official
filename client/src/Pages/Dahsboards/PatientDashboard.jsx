import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./Components/dashboardCard";
import StatusBar from "./Components/StatusBar";
import QuickAction from "./Components/QuickAction";
import UpdateSymptomModal from "../../patientConfig/UpdateSymptomModal";
import { dashboardAPI } from "../../services/api";
import { dashboardSections } from "../../config/dashboardSection";
import Footer from "./Components/Footer";
import Header from "../../components/Header";

const PatientDashboard = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [patient, setPatient] = useState({
    gender: "",
    age: "",
    medicalHistory: "",
  });

  // Modal state management
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptoms, setSymptoms] = useState([]); // Store symptoms data

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getPatientDashboard();
        const data = response.data.data;
        console.log(data.user);
        console.log(data.patient);

        setUser(data.user);
        setPatient(data.patient);

        // If you have symptoms data from API, set it here
        // setSymptoms(data.symptoms || []);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  const navigate = useNavigate();

  // Enhanced sections with modal trigger
  const sections = dashboardSections(navigate, {
    onSymptomsClick: () => {
      // Open modal for new symptom entry
      setSelectedSymptom(null);
      setModalOpen(true);
    },
    onEditSymptom: (symptom) => {
      // Open modal for editing existing symptom
      setSelectedSymptom(symptom);
      setModalOpen(true);
    },
  });

  // Handle symptom form submission
  const handleSymptomSubmit = async (formData) => {
    try {
      if (selectedSymptom) {
        // Update existing symptom
        console.log("Updating symptom:", formData);
        // Add your API call here
        // await symptomsAPI.updateSymptom(selectedSymptom.id, formData);

        // Update local state
        setSymptoms((prev) =>
          prev.map((symptom) =>
            symptom.id === selectedSymptom.id
              ? { ...symptom, ...formData }
              : symptom
          )
        );
      } else {
        // Create new symptom
        console.log("Creating new symptom:", formData);
        // Add your API call here
        // const response = await symptomsAPI.createSymptom(formData);

        // Update local state with new symptom
        const newSymptom = {
          id: Date.now(), // Replace with actual ID from API response
          ...formData,
          createdAt: new Date().toISOString(),
        };
        setSymptoms((prev) => [...prev, newSymptom]);
      }

      // Show success message
      alert(`Symptom ${selectedSymptom ? "updated" : "created"} successfully!`);
    } catch (error) {
      console.error("Error saving symptom:", error);
      alert("Error saving symptom. Please try again.");
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedSymptom(null);
    setModalOpen(false);
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-[#161515] py-8 pt-20">
        <div className="container mx-auto px-6">
          <StatusBar name={user.name} email={user.email} />

          {/* Dashboard Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <DashboardCard
                  key={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  color={section.color}
                  onClick={section.onClick}
                  badge={section.badge}
                  stats={section.stats}
                />
              ))}
            </div>
          </div>

          <QuickAction />
          <Footer />
        </div>
      </section>

      {/* Modal */}
      <UpdateSymptomModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSymptomSubmit}
        onClose={handleModalClose}
        initialData={selectedSymptom || {}}
      />
    </>
  );
};

export default PatientDashboard;
