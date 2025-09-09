// jobs/earthquakeJob.js
import cron from "node-cron";
import { fetchEarthquakeData } from "../services/earthquakeService.js";

export function startEarthquakeJob() {
  // Schedule automatic earthquake fetch every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    console.log("⏳ Running scheduled earthquake fetch...");
    try {
      const count = await fetchEarthquakeData();
      console.log(
        `✅ Scheduled fetch complete: ${count} earthquakes processed.`
      );
    } catch (err) {
      console.error("❌ Scheduled fetch failed:", err.message);
    }
  });
}
