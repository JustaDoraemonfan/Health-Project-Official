import { Stethoscope } from "lucide-react";

export const doctorRole = {
  id: "doctor",
  title: "Doctor",
  icon: Stethoscope,
  gradient: "from-emerald-500 via-teal-600 to-cyan-700",
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
  buttonColor:
    "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
  demo: "Register with specialization required",
};
