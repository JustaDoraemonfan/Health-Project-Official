import {
  Calendar,
  Plus,
  FileText,
  Clock,
  Pill,
  Activity,
  DollarSign,
  MessageCircle,
  CreditCard,
  Stethoscope,
  Bell,
} from "lucide-react";

export const dashboardSections = (navigate, modalHandlers = {}) => [
  {
    id: "consultation",
    title: "Book Consultation",
    description:
      "Schedule appointments with available doctors and specialists in your area.",
    icon: Calendar,
    color: "blue",
    onClick: () => navigate("/book-consultant"),
  },
  {
    id: "symptoms",
    title: "Update Symptoms",
    description:
      "Record and track your current symptoms with detailed descriptions.",
    icon: Plus,
    color: "green",
    onClick: () => {
      // Trigger symptom modal instead of navigation
      if (modalHandlers.onSymptomsClick) {
        modalHandlers.onSymptomsClick();
      } else {
        navigate("/symptoms");
      }
    },
  },
  {
    id: "records",
    title: "Health Records",
    description:
      "View your complete medical history and previous consultations.",
    icon: FileText,
    color: "purple",
    onClick: () => navigate("/patient/health"),
  },
  {
    id: "appointments",
    title: "Upcoming Appointments",
    description: "Manage and view all your scheduled medical appointments.",
    icon: Clock,
    color: "amber",
    badge: "2 upcoming",
    onClick: () => navigate("/patient/appointment"),
  },
  {
    id: "prescriptions",
    title: "Prescriptions",
    description:
      "Access current medications and view your prescription history.",
    icon: Pill,
    color: "red",
    badge: "3 active",
    onClick: () => navigate("/patient/prescription"),
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
    id: "medication-reminder",
    title: "Medication Reminder",
    description: "Create your own presonalized reminders.",
    icon: Bell,
    color: "amber",
    badge: "5 active",
    onClick: () => navigate("/patient/medication"),
  },
];

export const patientQuickActions = (navigate) => [
  {
    id: "emergency",
    title: "Emergency Contact",
    description: "Call emergency services",
    icon: Stethoscope,
    color: "orange",
    onClick: () => console.log("Emergency-contact"),
  },
  {
    id: "profile",
    title: "Manage your profile",
    description: "View & update profile details",
    icon: CreditCard,
    color: "slate",
    onClick: () => navigate("/update-profile"),
  },
];
