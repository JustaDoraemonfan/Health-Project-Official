import mongoose from "mongoose";

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
      default: Date.now,
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
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Symptom = mongoose.model("Symptom", symptomSchema);

export default Symptom;
