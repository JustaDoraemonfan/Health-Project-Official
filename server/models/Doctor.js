import mongoose from "mongoose";

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
      appliedAt: { type: Date },
      verifiedAt: { type: Date }, // When verification was approved
      reviewedAt: { type: Date }, // When last reviewed (approved or rejected)
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
          at: { type: Date, default: Date.now },
          notes: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
