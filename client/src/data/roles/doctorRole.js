import { Stethoscope } from "lucide-react";

export const doctorRole = {
  id: "doctor",
  title: "Doctor",
  icon: Stethoscope,
  gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
  bgColor: "bg-emerald-500",
  ringColor: "focus:ring-emerald-500",
  description:
    "Manage patient cases, conduct consultations, write prescriptions",
  features: [
    "Patient case management",
    "Video consultation platform",
    "Digital prescription writing",
    "Complete patient history access",
  ],
  buttonColor: "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500",
  demo: "Register with specialization required",
};
