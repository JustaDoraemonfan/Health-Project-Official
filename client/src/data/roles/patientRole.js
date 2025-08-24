import { Heart } from "lucide-react";

export const patientRole = {
  id: "patient",
  title: "Patient",
  icon: Heart,
  gradient: "from-blue-500 via-blue-600 to-blue-700",
  bgColor: "bg-blue-500",
  ringColor: "focus:ring-blue-500",
  description: "Book teleconsultations, upload symptoms, view prescriptions",
  features: [
    "Book video consultations",
    "Upload symptoms & medical images",
    "Access prescriptions & history",
    "Health education resources",
  ],
  buttonColor: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
  demo: "Register as Patient",
};
