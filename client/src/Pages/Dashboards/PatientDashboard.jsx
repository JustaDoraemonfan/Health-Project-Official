import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardComponents/dashboardCard";
import StatusBar from "./DashboardComponents/StatusBar";
import QuickAction from "./DashboardComponents/QuickAction";
import UpdateSymptomModal from "../../patientConfig/DashboardUtils/UpdateSymptomModal";
import { dashboardSections } from "../../config/patientDashboardSection";
import Footer from "./DashboardComponents/Footer";
import Header from "../../components/Header";
import { dashboardAPI, symptomAPI } from "../../services/api";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [response, symptomResp] = await Promise.all([
          dashboardAPI.getPatientDashboard(),
          symptomAPI.getSymptoms(),
        ]);
        const data = response.data.data;
        setUser(data.user);
        setPatient(data.patient);
        setSymptoms(symptomResp.data.data || []);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  const navigate = useNavigate();

  const sections = useMemo(
    () =>
      dashboardSections(navigate, {
        onSymptomsClick: () => {
          setSelectedSymptom(null);
          setModalOpen(true);
        },
        onEditSymptom: (symptom) => {
          setSelectedSymptom(symptom);
          setModalOpen(true);
        },
      }),
    [navigate],
  );

  const handleSymptomSubmit = async (formData) => {
    try {
      if (selectedSymptom) {
        await symptomAPI.updateSymptom(selectedSymptom._id, formData);
      } else {
        await symptomAPI.addSymptom(formData);
      }
    } catch (error) {
      console.error("Failed to submit symptom:", error.response?.data);
    }
  };

  const handleModalClose = () => {
    setSelectedSymptom(null);
    setModalOpen(false);
  };

  return (
    <>
      <Header />
      <section className="min-h-screen bg-[var(--color-primary)] py-6 sm:py-8 pt-16 sm:pt-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <StatusBar name={user.name} email={user.email} />

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
