// server/jobs/reminderScheduler.js
import schedule from "node-schedule";
import ReminderLog from "../models/Medication/ReminderLog.js";
let io = null; // set via initScheduler()
const jobs = new Map(); // in-memory job registry: logId -> schedule.Job

export const initScheduler = (socketIoInstance) => {
  io = socketIoInstance;
};

export const scheduleLogJob = (log) => {
  // log: mongoose doc or plain object with _id and scheduledFor (Date) and status
  const when = new Date(log.scheduledFor);
  const id = String(log._id);

  // If job already exists, cancel it first
  if (jobs.has(id)) {
    const prev = jobs.get(id);
    prev.cancel();
    jobs.delete(id);
  }

  // If time is in the past, emit immediately and mark 'due' (caller can update db if needed)
  if (when <= new Date()) {
    // If we have io and log hasn't been marked due yet, notify immediately
    if (io) io.emit("reminder-due", log);
    return;
  }

  const job = schedule.scheduleJob(when, async () => {
    try {
      // Mark the log as due in DB and re-fetch the updated log
      const updated = await ReminderLog.findByIdAndUpdate(
        id,
        { status: "due" },
        { new: true }
      ).lean();

      // Emit the event to connected clients
      if (io) io.emit("reminder-due", updated);
    } catch (err) {
      console.error("Error in scheduled reminder job:", err);
    } finally {
      // We keep the job in map until cancelled or it naturally fires (node-schedule keeps job reference after run).
      jobs.delete(id);
    }
  });

  jobs.set(id, job);
};

export const cancelLogJob = (logId) => {
  const id = String(logId);
  const job = jobs.get(id);
  if (job) {
    job.cancel();
    jobs.delete(id);
    return true;
  }
  return false;
};

// Reschedule all pending future logs (call at server start after DB connection)
export const reschedulePendingLogs = async () => {
  try {
    const pendingLogs = await ReminderLog.find({
      status: "pending",
      scheduledFor: { $gt: new Date() },
    }).lean();

    pendingLogs.forEach((log) => scheduleLogJob(log));
    console.log(`Rescheduled ${pendingLogs.length} pending reminder logs`);
  } catch (err) {
    console.error("Failed to reschedule pending logs:", err);
  }
};
