import mongoose from "mongoose";
// Assuming the path is relative to the models directory
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js";

// Helper function to get the current time in IST

const symptomSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Symptom description is required"],
      trim: true,
    },
    severity: {
      type: String,
      enum: ["Mild", "Moderate", "Severe"],
      required: [true, "Severity is required"],
    },
    onsetDate: {
      type: Date,
      default: nowInIST, // Use IST default
    },
    notes: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "neurological",
        "respiratory",
        "digestive",
        "cardiovascular",
        "musculoskeletal",
        "dermatological",
        "other",
      ],
      default: "other",
    },
    attachments: [
      {
        originalName: { type: String, required: true },
        mime: { type: String, required: true },
        size: { type: Number, required: true },
        filePath: { type: String, required: true }, // local or S3 path
        url: { type: String }, // public-facing URL if needed
        uploadedAt: { type: Date, default: nowInIST }, // Use IST default
      },
    ],
    // --- Timestamps ---
    // We manage these manually to ensure they use IST
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    // Disable default Mongoose timestamps (which use server time)
    timestamps: false,
  }
);

// Mongoose hook to set createdAt and updatedAt in IST before saving
symptomSchema.pre("save", function (next) {
  const now = nowInIST();
  this.updatedAt = now;
  if (this.isNew) {
    this.createdAt = now;
  }
  next();
});

// Hook for 'findOneAndUpdate' to update 'updatedAt' in IST
symptomSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: nowInIST() });
  next();
});

const Symptom = mongoose.model("Symptom", symptomSchema);

export default Symptom;
