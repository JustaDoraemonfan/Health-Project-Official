// Static data and configuration for Health Records
import { Calendar, Pill, FlaskConical, Stethoscope } from "lucide-react";

export const prescriptionsData = [
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

export const labReportsData = [
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

export const sections = [
  {
    id: "appointments",
    title: "Appointments",
    icon: Calendar,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    description: "View and manage your upcoming and past medical appointments",
  },
  {
    id: "prescriptions",
    title: "Prescriptions",
    icon: Pill,
    color: "green",
    gradient: "from-green-500 to-green-600",
    description: "Track your current medications and prescription history",
  },
  {
    id: "lab-reports",
    title: "Lab Reports",
    icon: FlaskConical,
    color: "amber",
    gradient: "from-purple-500 to-purple-600",
    description: "Access your laboratory test results and reports",
  },
  {
    id: "consultation-notes",
    title: "Consultation Notes",
    icon: Stethoscope,
    color: "red",
    gradient: "from-orange-500 to-orange-600",
    description: "Review notes and summaries from your consultations",
  },
];

export const filterOptions = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "upcoming", label: "Upcoming" },
  { value: "cancelled", label: "Cancelled" },
];
