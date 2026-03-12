import earthquakeRoutes from "./earthquakeRoutes.js";
// import { fetchEarthquakeData } from "./services/earthquakeService.js";
// import cron from "node-cron";
// import { startEarthquakeJob } from "./jobs/earthquakeJob.js";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import patientRoutes from "./patientRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import frontlineRoutes from "./frontlineRoutes.js";
import statsRoutes from "./statsRoutes.js";
import profileRoutes from "./profileRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import symptomRoutes from "./symptomRoutes.js";
import prescriptionRoutes from "./prescriptionRoutes.js";
import notesRoutes from "./notesRoutes.js";
import reminderRoutes from "./Medication/reminderRoutes.js";
import reminderLogRoutes from "./Medication/reminderLogRoutes.js";
import adminRoutes from "./adminRoutes.js";
import AnalyzeRoutes from "./PatientAnalyzeRoute.js";
import profilePhotoRoutes from "./profilePhotoRoutes.js";

export function registerRoutes(app) {
  app.get("/api/ping", (req, res) => res.json({ ok: true }));
  const routes = [
    ["/api/auth", authRoutes],
    ["/api/patients", patientRoutes],
    ["/api/doctors", doctorRoutes],
    ["/api/frontline", frontlineRoutes],
    ["/api/profile", profileRoutes],
    ["/api/appointments", appointmentRoutes],
    ["/api/symptoms", symptomRoutes],
    ["/api/prescriptions", prescriptionRoutes],
    ["/api/notes", notesRoutes],
    ["/api/earthquakes", earthquakeRoutes],
    ["/api/reminders", reminderRoutes],
    ["/api/reminder-logs", reminderLogRoutes],
    ["/api/admin", adminRoutes],
    ["/api/profile-photo", profilePhotoRoutes],
    ["/api", statsRoutes],
    ["/api/dashboard", dashboardRoutes],
    ["/api/patients", AnalyzeRoutes],
  ];

  for (const [path, router] of routes) {
    app.use(path, router);
  }
}
