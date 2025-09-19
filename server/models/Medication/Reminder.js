// models/Reminder.js
import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicine: { type: String, required: true },
    dosage: { type: String },
    frequency: {
      type: String,
      enum: ["daily", "multiple_times", "intervalHours"],
      default: "daily",
    },
    times: [{ type: String }], // ["08:00","20:00"] - HH:mm
    intervalHours: { type: Number }, // if frequency === 'intervalHours'
    startDate: { type: Date, default: () => new Date() }, // inclusive
    endDate: { type: Date, default: null }, // null = indefinite
    timezone: { type: String, default: "Asia/Kolkata" },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    doctorNote: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming User has role "doctor"
    },

    // NEW: daily status map
    dailyStatus: {
      type: Map,
      of: String, // "taken", "missed", "pending"
      default: {}, // starts empty
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", ReminderSchema);
