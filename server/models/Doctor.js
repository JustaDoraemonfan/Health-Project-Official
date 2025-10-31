import mongoose from "mongoose";
// Assuming the path is relative to the models directory
import { IST_TIMEZONE, nowInIST } from "../utils/dateUtils.js";

// Helper function to get the current time in IST

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialization: { type: String, required: true },
    experience: { type: Number, default: 0 },
    location: { type: String },
    isAvailable: {
      type: String,
      enum: ["Available", "Busy", "In Surgery", "On Break", "Offline"],
      default: "Available",
    },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    education: { type: String },
    languages: [{ type: String }],

    consultationFee: { type: Number, default: 0 },
    nextAvailable: { type: String },

    certifications: [{ type: String }],
    about: { type: String },
    phone: { type: String },
    profileUpdated: { type: Boolean, default: false },

    availability: [
      {
        day: String,
        slots: [String],
      },
    ],

    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],

    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],

    // --- Doctor Verification Section ---
    verification: {
      status: {
        type: String,
        enum: ["unverified", "pending", "verified", "rejected", "suspended"],
        default: "unverified",
      },
      appliedAt: { type: Date }, // Set by controller in IST
      verifiedAt: { type: Date }, // Set by controller in IST
      reviewedAt: { type: Date }, // Set by controller in IST
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // Who approved it
      reviewNotes: { type: String },
      rejectionReason: { type: String }, // Specific reason for rejection
      attempts: { type: Number, default: 0 },

      // NMC/State Medical Council Registration Details
      nmcRegistrationNumber: { type: String }, // Registration number

      // Document Evidence
      evidence: {
        nmcCertificate: { type: String }, // NMC/State Medical Council Registration Certificate
        mbbsCertificate: { type: String }, // MBBS Certificate
        internshipCertificate: { type: String }, // MBBS Internship Certificate
        aadharCard: { type: String }, // Aadhar Card

        // Optional legacy fields (keep for backward compatibility if needed)
        idDocument: { type: String },
        licenseDocument: { type: String },
        selfie: { type: String },
      },

      // Audit Trail
      auditTrail: [
        {
          action: {
            type: String,
            enum: [
              "applied",
              "approved",
              "rejected",
              "resubmitted",
              "suspended",
            ],
          },
          by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          at: { type: Date, default: nowInIST }, // Use IST for default
          notes: { type: String },
        },
      ],
    },

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
doctorSchema.pre("save", function (next) {
  const now = nowInIST();
  this.updatedAt = now;
  if (this.isNew) {
    this.createdAt = now;
  }
  next();
});

// Hook for 'findOneAndUpdate' to update 'updatedAt' in IST
doctorSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: nowInIST() });
  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
