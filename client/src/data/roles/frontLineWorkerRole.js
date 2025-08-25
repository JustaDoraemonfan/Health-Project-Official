import { Users } from "lucide-react";

export const frontlineWorkerRole = {
  id: "frontlineWorker",
  title: "Frontline Worker",
  icon: Users,
  gradient: "from-violet-500 via-purple-600 to-indigo-700",
  bgColor: "bg-purple-500",
  ringColor: "focus:ring-purple-500",
  description: "Register patients, upload community reports, follow up care",
  features: [
    "Community patient registration",
    "Health status reporting",
    "Prescription follow-ups",
    "Health data collection & analysis",
  ],
  buttonColor:
    "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700",
  demo: "Community health worker access",
};
