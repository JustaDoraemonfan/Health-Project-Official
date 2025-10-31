import mongoose from "mongoose";
// Assuming the path is relative to the models directory
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js";

// Helper function to get the current time in IST

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Basic Info
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    location: { type: String },
    contactNumber: { type: String },
    bloodGroup: { type: String },
    symptoms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Symptom" }],

    // Medical Information
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        status: { type: String, enum: ["ongoing", "recovered"] },
      },
    ],
    allergies: [{ type: String }],
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // doctor
      },
    ],
    surgeries: [
      {
        name: String,
        date: Date,
        hospital: String,
      },
    ],
    reports: [
      {
        title: String,
        fileUrl: String, // link to uploaded report (cloud/local storage)
        uploadedAt: { type: Date, default: nowInIST }, // Use IST default
      },
    ],

    // Care Team
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },

    // Insurance (optional)
    insurance: {
      provider: String,
      policyNumber: String,
      validTill: Date,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment", // reference to the Appointment model
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
patientSchema.pre("save", function (next) {
  const now = nowInIST();
  this.updatedAt = now;
  if (this.isNew) {
    this.createdAt = now;
  }
  next();
});

// Hook for 'findOneAndUpdate' to update 'updatedAt' in IST
patientSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: nowInIST() });
  next();
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
