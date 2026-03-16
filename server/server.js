import "dotenv/config";
import connectDB from "./config/dataBaseConnection.js";
import { createApp } from "./app.js";
import { startReminderJobs } from "./jobs/reminderScheduler.js";

// --- Environment variable validation ---
// Runs before anything else. A missing variable causes silent failures:
// JWT_SECRET missing = tokens signed with undefined, unpredictable auth.
// MONGO_URI missing = DB never connects, vague error 5s after startup.
const REQUIRED_ENV_VARS = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "GEMINI_API_KEY",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_REGION",
];

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingVars.forEach((key) => console.error("   - " + key));
  console.error("Add them to your .env file and restart the server.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

async function startServer() {
  await connectDB();
  startReminderJobs();

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running in ${NODE_ENV} mode on port ${PORT}`);
  });

  process.on("SIGINT", () => {
    console.log("🛑 Shutting down gracefully...");
    server.close(() => {
      console.log("💾 DB connection closed.");
      process.exit(0);
    });
  });
}

startServer().catch((err) => {
  // Log the full stack trace, not just err.message
  // err.message only gives one line — the stack shows exactly where it failed
  console.error("❌ Failed to start server:", err.stack || err.message);
  process.exit(1);
});
