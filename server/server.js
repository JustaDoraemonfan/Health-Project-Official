// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/dataBaseConnection.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import frontlineRoutes from "./routes/frontlineRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
// import appointmentRoutes from "./routes/appointmentRoutes.js";
// import symptomRoutes from "./routes/symptomRoutes.js";

// Load env vars
dotenv.config();

// Config values
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(helmet()); // Secure HTTP headers
if (NODE_ENV === "development") app.use(morgan("dev")); // Logging only in dev

// ---------- ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/frontline", frontlineRoutes);
app.use("/api", statsRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/symptoms", symptomRoutes);

// ---------- ERROR HANDLING ----------
app.use(notFound);
app.use(errorHandler);

// ---------- SERVER START ----------
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running in ${NODE_ENV} mode on port ${PORT}`);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("🛑 Server shutting down...");
      server.close(() => {
        console.log("💾 Closing DB connection...");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
