import mongoose from "mongoose";
// Assuming the path is relative to the models directory
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js";

const prescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: { type: String, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    filePath: { type: String, required: true }, // server path (not public)
    uploadedAt: { type: Date, default: nowInIST }, // Use IST default

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
prescriptionSchema.pre("save", function (next) {
  const now = nowInIST();
  this.updatedAt = now;
  if (this.isNew) {
    this.createdAt = now;
  }
  next();
});

// Hook for 'findOneAndUpdate' to update 'updatedAt' in IST
prescriptionSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: nowInIST() });
  next();
});

export default mongoose.model("Prescription", prescriptionSchema);
