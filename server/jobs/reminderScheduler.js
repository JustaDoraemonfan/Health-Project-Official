import cron from "node-cron";
import ReminderLog from "../models/Medication/ReminderLog.js";

export const startReminderJobs = () => {
  // Run every 5 minutes — marks pending reminder logs as missed
  // if they are more than 1 hour past their scheduled time.
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      const result = await ReminderLog.updateMany(
        {
          status: "pending",
          scheduledFor: { $lte: new Date(now.getTime() - 60 * 60 * 1000) },
        },
        { $set: { status: "missed" } },
      );

      if (result.modifiedCount > 0) {
        console.log(
          `⏰ Reminder job: marked ${result.modifiedCount} logs as missed`,
        );
      }
    } catch (err) {
      // Log but do not rethrow — an unhandled rejection here would
      // terminate the Node process in Node 15+.
      console.error("❌ Reminder job failed:", err.message);
    }
  });
};
