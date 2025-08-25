import { Heart } from "lucide-react";

export const patientRole = {
  id: "patient",
  title: "Patient",
  icon: Heart,
  gradient: "from-rose-500 via-pink-600 to-rose-700",
  bgColor: "bg-rose-500",
  ringColor: "focus:ring-rose-500",
  description: "Book teleconsultations, upload symptoms, view prescriptions",
  features: [
    "Book video consultations",
    "Upload symptoms & medical images",
    "Access prescriptions & history",
    "Health education resources",
  ],
  buttonColor:
    "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700",
  demo: "Register as Patient",
};
