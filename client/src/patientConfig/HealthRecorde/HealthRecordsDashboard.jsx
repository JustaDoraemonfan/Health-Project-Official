import React, { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Pill,
  FlaskConical,
  Stethoscope,
  Lock,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { appointmentAPI, prescriptionAPI } from "../../services/api";

const HealthRecordsDashboard = () => {
  const [appointmentsData, setAppointmentsData] = useState([]);
  // const [prescriptionsData, setPrescriptionsData] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const appointments = await appointmentAPI.getUpcomingAppointments();
        setAppointmentsData(appointments.data.data);
        console.log(appointments.data.data);

        // const prescription = await prescriptionAPI.getMyPrescriptions();
        // setPrescriptionsData(prescription.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  });

  // Dummy data - replace with API calls later
  // const appointmentsData = [
  //   {
  //     id: 1,
  //     date: "2024-09-10",
  //     time: "10:30 AM",
  //     doctor: "Dr. Sarah Johnson",
  //     specialty: "Cardiology",
  //     status: "upcoming",
  //   },
  //   {
  //     id: 2,
  //     date: "2024-09-05",
  //     time: "2:15 PM",
  //     doctor: "Dr. Michael Chen",
  //     specialty: "General Practice",
  //     status: "completed",
  //   },
  //   {
  //     id: 3,
  //     date: "2024-08-28",
  //     time: "11:00 AM",
  //     doctor: "Dr. Emily Rodriguez",
  //     specialty: "Dermatology",
  //     status: "completed",
  //   },
  //   {
  //     id: 4,
  //     date: "2024-08-15",
  //     time: "3:45 PM",
  //     doctor: "Dr. James Wilson",
  //     specialty: "Orthopedics",
  //     status: "cancelled",
  //   },
  //   {
  //     id: 5,
  //     date: "2024-09-15",
  //     time: "9:00 AM",
  //     doctor: "Dr. Lisa Park",
  //     specialty: "Neurology",
  //     status: "upcoming",
  //   },
  //   {
  //     id: 6,
  //     date: "2024-09-20",
  //     time: "2:30 PM",
  //     doctor: "Dr. Robert Kim",
  //     specialty: "Ophthalmology",
  //     status: "upcoming",
  //   },
  // ];

  const prescriptionsData = [
    {
      id: 1,
      medication: "Lisinopril 10mg",
      prescriber: "Dr. Sarah Johnson",
      date: "2024-09-05",
      refills: 2,
      dosage: "Once daily",
    },
    {
      id: 2,
      medication: "Metformin 500mg",
      prescriber: "Dr. Michael Chen",
      date: "2024-08-20",
      refills: 1,
      dosage: "Twice daily with meals",
    },
    {
      id: 3,
      medication: "Vitamin D3 1000IU",
      prescriber: "Dr. Emily Rodriguez",
      date: "2024-08-10",
      refills: 3,
      dosage: "Once daily",
    },
    {
      id: 4,
      medication: "Omeprazole 20mg",
      prescriber: "Dr. Sarah Johnson",
      date: "2024-07-15",
      refills: 0,
      dosage: "Once daily before breakfast",
    },
  ];

  const labReportsData = [
    {
      id: 1,
      test: "Complete Blood Count",
      date: "2024-09-03",
      status: "Normal",
      doctor: "Dr. Michael Chen",
      results: "All values within normal range",
    },
    {
      id: 2,
      test: "Lipid Panel",
      date: "2024-08-25",
      status: "High Cholesterol",
      doctor: "Dr. Sarah Johnson",
      results: "Total cholesterol: 245 mg/dL (High)",
    },
    {
      id: 3,
      test: "Thyroid Function",
      date: "2024-08-10",
      status: "Normal",
      doctor: "Dr. Michael Chen",
      results: "TSH: 2.1 mIU/L (Normal)",
    },
    {
      id: 4,
      test: "Hemoglobin A1C",
      date: "2024-07-20",
      status: "Normal",
      doctor: "Dr. Michael Chen",
      results: "5.4% (Normal)",
    },
  ];

  const consultationNotesData = [
    {
      id: 1,
      date: "2024-09-05",
      doctor: "Dr. Michael Chen",
      summary:
        "Annual checkup - Patient in good health, continue current medications. Blood pressure stable at 120/80. Recommended lifestyle modifications for cholesterol management.",
    },
    {
      id: 2,
      date: "2024-08-28",
      doctor: "Dr. Emily Rodriguez",
      summary:
        "Skin examination - Minor concerns addressed, follow-up in 6 months. No suspicious lesions found. Continue sun protection measures.",
    },
    {
      id: 3,
      date: "2024-08-20",
      doctor: "Dr. Sarah Johnson",
      summary:
        "Cardiovascular review - Blood pressure stable, medication adjusted. Patient responding well to current treatment plan. Next appointment in 3 months.",
    },
    {
      id: 4,
      date: "2024-07-15",
      doctor: "Dr. James Wilson",
      summary:
        "Orthopedic consultation - Knee pain assessment. Recommended physical therapy and anti-inflammatory medication. Follow-up in 6 weeks.",
    },
  ];

  const sections = [
    {
      id: "appointments",
      title: "Appointments",
      icon: Calendar,
      color: "blue",
      count: appointmentsData.length,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "prescriptions",
      title: "Prescriptions",
      icon: Pill,
      color: "green",
      count: prescriptionsData.length,
      gradient: "from-green-500 to-green-600",
    },
    {
      id: "lab-reports",
      title: "Lab Reports",
      icon: FlaskConical,
      color: "purple",
      count: labReportsData.length,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: "consultation-notes",
      title: "Consultation Notes",
      icon: Stethoscope,
      color: "orange",
      count: consultationNotesData.length,
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "upcoming":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getLabStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (status.toLowerCase().includes("normal")) {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const filteredAppointments = appointmentsData.filter((appointment) => {
    if (appointmentFilter === "all") return true;
    return appointment.status === appointmentFilter;
  });

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "upcoming", label: "Upcoming" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (selectedSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedSection(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-3">
                  <div
                    className={`bg-gradient-to-r ${
                      sections.find((s) => s.id === selectedSection)?.gradient
                    } p-2 rounded-lg`}
                  >
                    {React.createElement(
                      sections.find((s) => s.id === selectedSection)?.icon ||
                        FileText,
                      { className: "w-6 h-6 text-white" }
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {sections.find((s) => s.id === selectedSection)?.title}
                  </h2>
                </div>
              </div>

              {selectedSection === "appointments" && (
                <div className="flex space-x-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAppointmentFilter(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        appointmentFilter === option.value
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="grid gap-4">
            {selectedSection === "appointments" &&
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-semibold text-gray-900">
                              {appointment.appointmentDate}
                            </span>
                            <span className="text-gray-500">
                              at {appointment.appointmentTime}
                            </span>
                            <span
                              className={getStatusBadge(appointment.status)}
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-gray-600 mt-1">
                            <span className="font-medium">
                              {appointment.doctor.name}
                            </span>{" "}
                            • {appointment.doctor.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {selectedSection === "prescriptions" &&
              prescriptionsData.map((prescription) => (
                <div
                  key={prescription.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <Pill className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prescription.medication}
                        </h3>
                        <span className="text-sm font-medium text-gray-600">
                          {prescription.refills} refills left
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {prescription.dosage}
                      </p>
                      <div className="text-sm text-gray-500">
                        Prescribed by{" "}
                        <span className="font-medium">
                          {prescription.prescriber}
                        </span>{" "}
                        on {prescription.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {selectedSection === "lab-reports" &&
              labReportsData.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <FlaskConical className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.test}
                        </h3>
                        <span className={getLabStatusBadge(report.status)}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{report.results}</p>
                      <div className="text-sm text-gray-500">
                        {report.date} • Ordered by{" "}
                        <span className="font-medium">{report.doctor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {selectedSection === "consultation-notes" &&
              consultationNotesData.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-50 p-3 rounded-lg mt-1">
                      <Stethoscope className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-lg font-semibold text-gray-900">
                          {note.date}
                        </span>
                        <span className="text-gray-500">by {note.doctor}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {note.summary}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Secure Access Footer */}
        <div className="bg-white border-t border-gray-200 mt-8">
          <div className="px-6 py-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>
                Secure Access - Your health information is protected and
                encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Health Records
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and view your medical information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 cursor-pointer transform hover:scale-105 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`bg-gradient-to-r ${section.gradient} p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-300">
                    {section.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`bg-${section.color}-100 text-${section.color}-800 px-3 py-1 rounded-full text-sm font-semibold`}
                    >
                      {section.count} items
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {section.id === "appointments" &&
                    "View and manage your upcoming and past medical appointments"}
                  {section.id === "prescriptions" &&
                    "Track your current medications and prescription history"}
                  {section.id === "lab-reports" &&
                    "Access your laboratory test results and reports"}
                  {section.id === "consultation-notes" &&
                    "Review notes and summaries from your consultations"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {appointmentsData.filter((a) => a.status === "upcoming").length}
              </div>
              <div className="text-gray-600">Upcoming Appointments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {prescriptionsData.filter((p) => p.refills > 0).length}
              </div>
              <div className="text-gray-600">Active Prescriptions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {
                  labReportsData.filter(
                    (l) =>
                      l.date.includes("2024-09") || l.date.includes("2024-08")
                  ).length
                }
              </div>
              <div className="text-gray-600">Recent Lab Reports</div>
            </div>
          </div>
        </div>

        {/* Secure Access Footer */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <Lock className="w-5 h-5" />
            <span className="font-medium">Secure Access</span>
            <span>•</span>
            <span>Your health information is protected and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecordsDashboard;
