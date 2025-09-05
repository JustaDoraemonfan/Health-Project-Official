import {
  Calendar,
  Users,
  FileText,
  Stethoscope,
  Bell,
  Settings,
  BarChart3,
  Pill,
  UserCheck,
  Activity,
  Clock,
  MessageCircle,
  Phone,
  ClipboardList,
  Shield,
  TrendingUp,
  Upload,
} from "lucide-react";

export const doctorDashboardSections = (navigate, openUploadModal) => [
  {
    id: "appointments",
    title: "Today's Appointments",
    description:
      "View and manage your scheduled appointments, consultations, and follow-ups for today.",
    icon: Calendar,
    color: "blue",
    stats: "12 today",
    badge: "3 urgent",
    onClick: () => navigate("/doctor/appointment"),
  },
  {
    id: "patients",
    title: "Patient Management",
    description:
      "Access patient profiles, medical histories, treatment plans, and care coordination.",
    icon: Users,
    color: "green",
    stats: "247 active",
    onClick: () => navigate("/doctor/patients"),
  },
  {
    id: "medical-records",
    title: "Medical Records",
    description:
      "Review, update, and manage comprehensive patient medical records and documentation.",
    icon: FileText,
    color: "purple",
    stats: "15 pending",
    onClick: () => navigate("/doctor/medical-records"),
  },
  {
    id: "prescriptions",
    title: "Prescriptions",
    description:
      "Create, modify, and track prescriptions with integrated pharmacy management system.",
    icon: Pill,
    color: "teal",
    stats: "8 to review",
    onClick: () => {
      openUploadModal();
    },
  },
  {
    id: "consultations",
    title: "Consultations",
    description:
      "Conduct virtual consultations, review consultation history, and manage telemedicine sessions.",
    icon: Stethoscope,
    color: "indigo",
    stats: "3 scheduled",
    onClick: () => navigate("/doctor/consultations"),
  },
  {
    id: "lab-results",
    title: "Lab Results & Reports",
    description:
      "Review diagnostic reports, laboratory results, and coordinate with pathology departments.",
    icon: Activity,
    color: "blue",
    stats: "6 new",
    onClick: () => navigate("/doctor/lab-results"),
  },
  {
    id: "schedule",
    title: "Schedule Management",
    description:
      "Manage your availability, block time slots, and coordinate with hospital scheduling.",
    icon: Clock,
    color: "amber",
    onClick: () => navigate("/doctor/schedule"),
  },
  {
    id: "messages",
    title: "Secure Messages",
    description:
      "Communicate securely with patients, colleagues, and healthcare staff members.",
    icon: MessageCircle,
    color: "purple",
    badge: "7 new",
    onClick: () => navigate("/doctor/messages"),
  },
  {
    id: "analytics",
    title: "Analytics & Reports",
    description:
      "View practice analytics, patient outcomes, performance metrics, and generate reports.",
    icon: BarChart3,
    color: "green",
    onClick: () => navigate("/doctor/analytics"),
  },
  {
    id: "notifications",
    title: "Notifications",
    description:
      "Critical alerts, lab results, appointment changes, and urgent patient updates.",
    icon: Bell,
    color: "red",
    badge: "5 critical",
    onClick: () => navigate("/doctor/notifications"),
  },
  {
    id: "emergency",
    title: "Emergency Protocols",
    description:
      "Access emergency procedures, rapid response protocols, and critical care guidelines.",
    icon: Phone,
    color: "red",
    onClick: () => navigate("/doctor/emergency"),
  },
  {
    id: "patient-notes",
    title: "Clinical Notes",
    description:
      "Create, edit, and manage detailed clinical notes and treatment observations.",
    icon: ClipboardList,
    color: "indigo",
    stats: "4 drafts",
    onClick: () => navigate("/doctor/clinical-notes"),
  },
  {
    id: "compliance",
    title: "Compliance & Quality",
    description:
      "Monitor compliance metrics, quality indicators, and regulatory requirements.",
    icon: Shield,
    color: "amber",
    onClick: () => navigate("/doctor/compliance"),
  },
  {
    id: "performance",
    title: "Performance Metrics",
    description:
      "Track patient satisfaction, treatment outcomes, and professional development goals.",
    icon: TrendingUp,
    color: "teal",
    onClick: () => navigate("/doctor/performance"),
  },
  {
    id: "profile",
    title: "Profile & Settings",
    description:
      "Manage your professional profile, preferences, security settings, and system configuration.",
    icon: Settings,
    color: "blue",
    onClick: () => navigate("/doctor/profile"),
  },
];

// Updated Quick Actions configuration for doctors with upload prescription
export const doctorQuickActions = (navigate, openUploadModal) => [
  {
    id: "emergency-protocol",
    title: "Emergency Protocol",
    description: "Rapid response system",
    icon: Phone,
    color: "red",
    onClick: () => navigate("/doctor/emergency-protocol"),
  },
  {
    id: "upload-prescription",
    title: "Upload Prescription",
    description: "Upload patient prescriptions",
    icon: Upload,
    color: "blue",
    onClick: openUploadModal,
  },
  {
    id: "quick-prescription",
    title: "Quick Prescription",
    description: "Generate prescriptions",
    icon: Pill,
    color: "green",
    onClick: () => navigate("/doctor/quick-prescription"),
  },
  {
    id: "patient-lookup",
    title: "Patient Lookup",
    description: "Search patient records",
    icon: UserCheck,
    color: "blue",
    onClick: () => navigate("/doctor/patient-lookup"),
  },
];

// Status configuration for doctor
export const doctorStatus = {
  role: "Doctor",
  statusColor: "green",
  statusText: "Available",
  animated: true,
  welcomeMessage: "Managing patient care with precision",
};

// Footer links configuration for doctors
export const doctorFooterLinks = [
  {
    text: "Medical Guidelines",
    href: "/doctor/guidelines",
  },
  {
    text: "IT Support",
    href: "/support",
  },
  {
    text: "Emergency Contacts",
    href: "/doctor/emergency-contacts",
  },
];
