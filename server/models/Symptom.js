import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    symptoms: [
      {
        name: { type: String, required: true },
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
          default: "mild",
        },
        duration: { type: String },
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Symptom = mongoose.model("Symptom", symptomSchema);
export default Symptom;
