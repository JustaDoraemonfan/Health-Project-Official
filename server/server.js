// server.js
import "dotenv/config";
import connectDB from "./config/dataBaseConnection.js";
import { createApp } from "./app.js";
import { startReminderJobs } from "./jobs/reminderScheduler.js";
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

async function startServer() {
  await connectDB();
  startReminderJobs();

  const app = createApp();
  app.get("/ping", (req, res) => res.json({ ok: true }));
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
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});
