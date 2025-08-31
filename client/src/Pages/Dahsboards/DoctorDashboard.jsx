import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./Components/dashboardCard";
import StatusBar from "./Components/StatusBar";
import QuickAction from "./Components/QuickAction";
import { dashboardAPI, doctorAPI } from "../../services/api";
import { doctorDashboardSections } from "../../config/doctorDashboardSections";
import Footer from "./Components/Footer";
import Header from "../../components/Header";

const DoctorDashboard = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await dashboardAPI.getDoctorDashboard();
        const data = response.data.data;
        const response2 = await doctorAPI.getDoctor(data.doctor.id);
        const doctorInfo = response2.data.data;

        console.log("Doctor dashboard data:", data); // Debug log
        console.log("Doctor:", doctorInfo); // Debug log

        setUser(data.user);
        setDoctor(doctorInfo);
      } catch (err) {
        console.error("Failed to fetch doctor stats:", err);
        setError(err.message);

        // Set fallback data for development
        setUser({
          id: "doc001",
          name: "Dr. Sarah Johnson",
          email: "dr.johnson@hospital.com",
          role: "doctor",
        });
        setDoctor({
          specialization: "Cardiologist",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Get sections from config
  const sections = doctorDashboardSections(navigate);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#161515] flex items-center justify-center">
        <div className="text-white text-xl font-mono">
          Loading doctor dashboard...
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !user.name) {
    return (
      <div className="min-h-screen bg-[#161515] flex items-center justify-center">
        <div className="text-red-400 text-xl font-mono">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-[#161515] py-8 pt-20">
        <div className="container mx-auto px-6">
          {/* Status Bar - Pass role and specialization */}
          <StatusBar
            name={user.name}
            email={user.email}
            role="doctor"
            specialization={doctor.specialization}
            isAvailable={doctor.isAvailable}
            id={doctor._id}
          />

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
                  stats={section.stats} // Make sure to pass stats
                />
              ))}
            </div>
          </div>

          {/* Quick Actions Section */}
          <QuickAction role="doctor" />

          {/* Footer */}
          <Footer role="doctor" />
        </div>
      </section>
    </>
  );
};

export default DoctorDashboard;
