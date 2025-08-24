import { Shield } from "lucide-react";

export const adminRole = {
  id: "admin",
  title: "Admin / Public Health",
  icon: Shield,
  gradient: "from-indigo-500 via-indigo-600 to-indigo-700",
  bgColor: "bg-indigo-500",
  ringColor: "focus:ring-indigo-500",
  description:
    "Analytics dashboards, outbreak monitoring, system administration",
  features: [
    "Comprehensive health analytics",
    "Disease outbreak monitoring",
    "System-wide administration",
    "Population health insights",
  ],
  buttonColor: "bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500",
  demo: "Full system administration access",
};
