import "dotenv/config";
import connectDB from "./config/dataBaseConnection.js";
import { createApp } from "./app.js";
import { startReminderJobs } from "./jobs/reminderScheduler.js";

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
