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
  { timestamps: true }
);

export default mongoose.model("ReminderLog", ReminderLogSchema);
