import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./Components/dashboardCard";
import StatusBar from "./Components/StatusBar";
import QuickAction from "./Components/QuickAction";
import { dashboardAPI } from "../../services/api";
import { dashboardSections } from "../../config/dashboardSection";
import Footer from "./Components/Footer";

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getPatientDashboard();
        const data = response.data.data;
        console.log(data.user);
        console.log(data.patient);

        setUser(data.user);
        setPatient(data.patient);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const sections = dashboardSections(navigate);

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login after logout
  };
  return (
    <section className="min-h-screen bg-[#161515] py-8">
      <div className="container mx-auto px-6">
        {/* Header Section */}
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
              />
            ))}
          </div>
        </div>
        {/* Quick Actions Section */}
        <QuickAction />
        {/* Footer */}
        <Footer handleLogout={handleLogout} />
      </div>
    </section>
  );
};

export default PatientDashboard;
