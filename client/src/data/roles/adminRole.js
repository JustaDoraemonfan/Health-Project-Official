import { Shield } from "lucide-react";

export const adminRole = {
  id: "admin",
  title: "Admin / Public Health",
  icon: Shield,
  gradient: "from-amber-500 via-orange-600 to-red-700",
  bgColor: "bg-amber-500",
  ringColor: "focus:ring-amber-500",
  description:
    "Analytics dashboards, outbreak monitoring, system administration",
  features: [
    "Comprehensive health analytics",
    "Disease outbreak monitoring",
    "System-wide administration",
    "Population health insights",
  ],
  buttonColor:
    "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
  demo: "Full system administration access",
};
