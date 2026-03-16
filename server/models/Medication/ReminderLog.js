// models/ReminderLog.js
import mongoose from "mongoose";

const ReminderLogSchema = new mongoose.Schema(
  {
    reminderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reminder",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledFor: { type: Date, required: true }, // UTC time when it was scheduled
    status: {
      type: String,
      enum: ["taken", "skipped", "missed"],
    },
    respondedAt: { type: Date, default: null },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

// --- Indexes ---
// Core fetch: all logs for a user sorted by scheduled time (getReminderLogs)
ReminderLogSchema.index({ userId: 1, scheduledFor: -1 });

// Cron job query (runs every 5 min): pending logs past their scheduled time
ReminderLogSchema.index({ status: 1, scheduledFor: 1 });

// Fetch logs for a specific reminder (populate/detail views)
ReminderLogSchema.index({ reminderId: 1, scheduledFor: -1 });

export default mongoose.model("ReminderLog", ReminderLogSchema);
