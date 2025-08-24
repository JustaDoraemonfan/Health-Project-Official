import { Users } from "lucide-react";

export const frontlineWorkerRole = {
  id: "frontlineWorker",
  title: "Frontline Worker",
  icon: Users,
  gradient: "from-purple-500 via-purple-600 to-purple-700",
  bgColor: "bg-purple-500",
  ringColor: "focus:ring-purple-500",
  description: "Register patients, upload community reports, follow up care",
  features: [
    "Community patient registration",
    "Health status reporting",
    "Prescription follow-ups",
    "Health data collection & analysis",
  ],
  buttonColor: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500",
  demo: "Community health worker access",
};
