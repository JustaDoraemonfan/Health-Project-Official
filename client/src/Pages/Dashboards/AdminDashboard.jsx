import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardComponents/dashboardCard";
import StatusBar from "./DashboardComponents/StatusBar";
import QuickAction from "./DashboardComponents/QuickAction";
import { adminAPI, dashboardAPI } from "../../services/api";
import { adminDashboardSections } from "../../config/adminDashboardSection";
import Footer from "./DashboardComponents/Footer";
import Header from "../../components/Header";

const AdminDashboard = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await dashboardAPI.getAdminDashboard();
        const data = response.data.data;
        const response2 = await adminAPI.getAdmin(data.admin.id);
        const adminInfo = response2.data.data;

        console.log("Admin dashboard data:", data); // Debug log
        console.log("Admin:", adminInfo); // Debug log

        setUser(data.user);
        setAdmin(adminInfo);
      } catch (err) {
        console.error("Failed to fetch doctor stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Get sections from config
  // Get sections from config
  const sections = adminDashboardSections(navigate, () =>
    setIsUploadModalOpen(true)
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#161515] flex items-center justify-center">
        <div className="text-white text-xl google-sans-code-400">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !user.name) {
    return (
      <div className="min-h-screen bg-[#161515] flex items-center justify-center">
        <div className="text-red-400 text-xl google-sans-code-400">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-[var(--color-primary)] py-8 pt-20">
        <div className="container mx-auto px-6">
          {/* Status Bar with Upload Button */}
          <StatusBar
            name={user.name}
            email={user.email}
            role="admin"
            department={admin.department}
            id={admin._id}
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
                  stats={section.stats}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions Section */}
          <QuickAction role="admin" />

          {/* Footer */}
          <Footer role="admin" />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
