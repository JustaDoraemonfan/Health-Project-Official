import cron from "node-cron";
import ReminderLog from "../models/Medication/ReminderLog.js";
export const startReminderJobs = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();

    const result = await ReminderLog.updateMany(
      {
        status: "pending",
        scheduledFor: { $lte: new Date(now.getTime() - 60 * 60 * 1000) },
      },
      { $set: { status: "missed" } }
    );

    console.log(`Updated ${result.modifiedCount} reminders to missed`);
  });
};
