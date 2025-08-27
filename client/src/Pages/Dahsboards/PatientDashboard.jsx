import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Plus,
  FileText,
  User,
  Clock,
  Pill,
  Activity,
  DollarSign,
  MessageCircle,
  Bell,
  ChevronRight,
  Stethoscope,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import StatusBar from "./PatientComponents/StatusBar";
import QuickAction from "./PatientComponents/QuickAction";
// import Header from "../../components/Header";
import { dashboardAPI } from "../../services/api";
import Footer from "./PatientComponents/Footer";

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

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login after logout
  };

  // Color classes function from LoginSection
  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 border-blue-500",
      green: "from-green-500 to-green-600 border-green-500",
      purple: "from-purple-500 to-purple-600 border-purple-500",
      red: "from-red-500 to-red-600 border-red-500",
      amber: "from-amber-500 to-amber-600 border-amber-500",
    };
    return colors[color];
  };

  // Reusable Dashboard Card Component
  const DashboardCard = ({
    title,
    description,
    icon: Icon,
    color,
    onClick,
    badge = null,
    isLarge = false,
  }) => {
    return (
      <div
        className={`bg-gradient-to-r from-stone-900 to-slate-900 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer ${
          isLarge ? "col-span-2" : ""
        }`}
        onClick={onClick}
      >
        {/* Card Header with gradient */}
        <div
          className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${
            getColorClasses(color).split(" ")[0]
          } ${getColorClasses(color).split(" ")[1]}`}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-mono font-semibold">
              {title}
            </span>
          </div>
          {badge && (
            <span className="bg-amber-50 bg-opacity-20 text-red-950 text-xs font-mono px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          <p className="text-slate-50 text-sm font-mono leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between">
            <button
              className={`text-xs font-mono px-3 py-1 rounded border bg-gradient-to-r ${getColorClasses(
                color
              )} text-white hover:opacity-90 transition-opacity`}
            >
              Access
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    );
  };

  // Dashboard sections data
  const dashboardSections = [
    {
      id: "consultation",
      title: "Book Consultation",
      description:
        "Schedule appointments with available doctors and specialists in your area.",
      icon: Calendar,
      color: "blue",
      onClick: () => console.log("Book consultation clicked"),
    },
    {
      id: "symptoms",
      title: "Update Symptoms",
      description:
        "Record and track your current symptoms with detailed descriptions.",
      icon: Plus,
      color: "green",
      onClick: () => console.log("Update symptoms clicked"),
    },
    {
      id: "records",
      title: "Health Records",
      description:
        "View your complete medical history and previous consultations.",
      icon: FileText,
      color: "purple",
      onClick: () => console.log("Health records clicked"),
    },
    {
      id: "appointments",
      title: "Upcoming Appointments",
      description: "Manage and view all your scheduled medical appointments.",
      icon: Clock,
      color: "amber",
      badge: "2 upcoming",
      onClick: () => console.log("Appointments clicked"),
    },
    {
      id: "prescriptions",
      title: "Prescriptions",
      description:
        "Access current medications and view your prescription history.",
      icon: Pill,
      color: "red",
      badge: "3 active",
      onClick: () => console.log("Prescriptions clicked"),
    },
    {
      id: "lab-results",
      title: "Lab Results",
      description: "Review diagnostic reports and laboratory test results.",
      icon: Activity,
      color: "blue",
      onClick: () => console.log("Lab results clicked"),
    },
    {
      id: "billing",
      title: "Billing & Payments",
      description:
        "View invoices, payment history, and manage billing information.",
      icon: DollarSign,
      color: "green",
      onClick: () => console.log("Billing clicked"),
    },
    {
      id: "messages",
      title: "Messages",
      description:
        "Secure communication with your healthcare providers and doctors.",
      icon: MessageCircle,
      color: "purple",
      badge: "1 new",
      onClick: () => console.log("Messages clicked"),
    },
    {
      id: "notifications",
      title: "Notifications",
      description:
        "Medicine reminders, appointment alerts, and health notifications.",
      icon: Bell,
      color: "amber",
      badge: "5 active",
      onClick: () => console.log("Notifications clicked"),
    },
  ];

  return (
    <section className="min-h-screen bg-[#161515] py-8">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <StatusBar name={user.name} email={user.email} />

        {/* Dashboard Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardSections.map((section) => (
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
