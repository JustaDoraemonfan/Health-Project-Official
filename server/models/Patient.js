import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    medicalHistory: [{ type: String }], // past diseases or conditions
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to doctor
  },
  { timestamps: true }
);
const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
