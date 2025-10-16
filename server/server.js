// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/dataBaseConnection.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import earthquakeRoutes from "./routes/earthquakeRoutes.js";
import { fetchEarthquakeData } from "./services/earthquakeService.js";
import cron from "node-cron";
import { startEarthquakeJob } from "./jobs/earthquakeJob.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import frontlineRoutes from "./routes/frontlineRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import symptomRoutes from "./routes/symptomRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import reminderRoutes from "./routes/Medication/reminderRoutes.js";
import reminderLogRoutes from "./routes/Medication/reminderLogRoutes.js";
import { startReminderJobs } from "./jobs/reminderScheduler.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load env vars
dotenv.config();

// Config values
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
// eslint-disable-next-line no-undef
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
// eslint-disable-next-line no-undef
const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(helmet()); // Secure HTTP headers
if (NODE_ENV === "development") app.use(morgan("dev")); // Logging only in dev

// Setup __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Make the 'uploads' folder publicly accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/frontline", frontlineRoutes);
app.use("/api", statsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/earthquakes", earthquakeRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/reminder-logs", reminderLogRoutes);
app.use("/api/admin", adminRoutes);

// ---------- ERROR HANDLING ----------
app.use(notFound);
app.use(errorHandler);

// ---------- SERVER START ----------
const startServer = async () => {
  try {
    await connectDB();
    startReminderJobs();
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    // Graceful shutdown
    // eslint-disable-next-line no-undef
    process.on("SIGINT", () => {
      console.log("🛑 Server shutting down...");
      server.close(() => {
        console.log("💾 Closing DB connection...");
        // eslint-disable-next-line no-undef
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

startServer();
