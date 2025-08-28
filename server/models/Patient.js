import mongoose from "mongoose";

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
        uploadedAt: { type: Date, default: Date.now },
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
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
